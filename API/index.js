// const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config/default');
const utils = require('./utils');
const db = require('./models');
const userActions = require('./actions/users');
const textActions = require('./actions/texts');
const queueActions = require('./actions/queue');
const workerActions = require('./actions/workers');
const vocabularyActions = require('./actions/vocabularies');
const datasetActions = require('./actions/datasets');
const modelActions = require('./actions/models');
const graphActions = require('./actions/graph');

// Middlewares

app.use(express.static('resources/public'));

// Use the basicAuth middleware for all /user routes
// app.use('/api/user', utils.basicAuth);
// app.use('/api/users', utils.basicAuth);
// app.use('/api/worker', utils.basicAuthWorkers);
// app.use('/api/queue', utils.basicAuthWorkers);

// Routes

// User routes
// Log a user in
app.get('/api/user/login', (req, res) => userActions.login(req, res));
// Register a new user
app.post('/api/user', bodyParser.json(), (req, res) => userActions.add(req, res));
app.get('/api/users', (req, res) => userActions.get(req, res));
app.delete('/api/user', (req, res) => userActions.delete(req, res));

// Text Routes
app.get('/api/queue/task', (req, res) => queueActions.getLast(req, res));
app.delete('/api/queue/task', bodyParser.json(), (req, res) => queueActions.endTask(req, res, io));

app.post('/api/summary/store', bodyParser.json(), (req, res) => textActions.store(req, res));
app.get('/api/user/summary', (req, res) => textActions.getSummary(req, res));
app.get('/api/user/article', (req, res) => textActions.getArticle(req, res));

// Workers Routes
// - Get number of workers
app.get('/api/workers', (req, res) => {
    let connected = 0;
    Object.keys(io.sockets.connected).forEach(id => {
        const s = io.sockets.connected[id];
        if(Object.keys(s.rooms).indexOf('workers') !== -1) connected++;
    });
    res.json(connected);
});
// - Get all registered workers
app.get('/api/user/workers', (req, res) => workerActions.get(req, res));
// - Register a new worker
app.post('/api/user/worker', bodyParser.json(), (req, res) => workerActions.register(req, res));
app.delete('/api/user/worker', (req, res) => workerActions.unregister(req, res));

// Routes for vocab
app.post('/api/vocabulary', (req, res) => vocabularyActions.add(req, res));
app.get('/api/vocabulary/one', (req, res) => vocabularyActions.getOne(req, res));
app.get('/api/vocabulary', (req, res) => vocabularyActions.get(req, res));

// Routes for datasets
app.post('/api/dataset/article', bodyParser.json(), (req, res) => datasetActions.addArticle(req, res));
app.get('/api/dataset/count', (req, res) => datasetActions.count(req, res));
app.post('/api/dataset', (req, res) => datasetActions.add(req, res));
app.get('/api/dataset', (req, res) => datasetActions.getArticles(req, res));
app.get('/api/dataset/info', (req, res) => datasetActions.get(req, res));

// Routes for model
app.get('/api/models/all', (req, res) => modelActions.getAll(req, res));
app.put('/api/model/toggle-auto', (req, res) => modelActions.toggleAutomatic(req, res));
app.get('/api/metrics', (req, res) => modelActions.getMetrics(req, res));
app.post('/api/metric', (req, res) => modelActions.addMetric(req, res));
app.delete('/api/metric', (req, res) => modelActions.deleteMetric(req, res));
app.put('/api/metric', bodyParser.json(), (req, res) => modelActions.changeOrder(req, res));
app.post('/api/model', (req, res) => modelActions.add(req, res));
app.get('/api/model/actions', (req, res) => modelActions.getActions(req, res));
app.get('/api/preference', (req, res) => modelActions.getPreferences(req, res));
app.post('/api/preference/treated', (req, res) => modelActions.setPreferenceAsTreated(req, res));
app.post('/api/model/action', bodyParser.json(), (req, res) => modelActions.addAction(req, res, io));
app.post('/api/model/preference', (req, res) => modelActions.addPreference(req, res));

// Routes for graphs and measurements
app.get('/api/graphs', (req, res) => graphActions.getGraphs(req, res));
app.get('/api/graph/measurements', (req, res) => graphActions.getMeasurements(req, res));
app.post('/api/graph/measurement', bodyParser.json(), (req, res) => graphActions.addMeasurement(req, res, io));
app.post('/api/graph/step', (req, res) => graphActions.addGraphStep(req, res, io));


// Fallback *Must be the last route*

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './resources/public/index.html')));

// Websocket routes
io.on('connect', (socket) => {
    const params = socket.handshake.query;
    const isWorker = params.type === 'worker';

    if(isWorker) {
        utils.authWorker(params.name, params.password, () => {
            socket.join('workers');
            socket.on('responseMetric', data => console.log(data));
            socket.on('execMetricReady', () => modelActions.sendReadyActions(io));
            socket.on('saveAutoPreference', (data) => modelActions.saveAutoPreference(io, data));
            db.Queue.count({ where: { status: 0 } }).then(sizeQueue => socket.emit('pushQueue', sizeQueue));
            db.Worker.update({status: 1}, { where: { name: params.name } }).then(() =>
                workerActions.add(io)
            );
        });
    } else {
        socket.join('clients');
        socket.on('pushQueue', data => queueActions.push(io, socket, data));
        socket.on('computeMetrics', () => io.sockets.to('workers').emit('execMetricRequest'));
    }
    socket.on('disconnect', (reason) => {
        if(isWorker) {
            utils.authWorker(params.name, params.password, () => {
                db.Worker.update({status: 0}, { where: { name: params.name } }).then(() =>
                    workerActions.remove(io)
                );
            });
        }else {
            // We delete the user from connected users
            db.Queue.destroy({
                where: {
                    uid: socket.id,
                    status: 0
                }
            });
        }
    });
});

// Start application
server.listen(config.app.port, config.app.host, () => {
    console.log(`API listening on port ${config.app.port}`);
    // Try connecting to the database
    db.sequelize.authenticate()
        .then(() => console.log('Successfully logged to the database'))
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
});
