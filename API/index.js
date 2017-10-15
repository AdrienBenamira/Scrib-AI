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

let connectedSocketUsers = {};
let connectedWorkers = 0;

// Middlewares

// TODO: configure cors to only allow the interface
// app.use(cors());
// io.origins('*:*');

app.use(express.static('resources/public'));

// Use the basicAuth middleware for all /user routes
app.use('/api/user', utils.basicAuth);
app.use('/api/users', utils.basicAuth);
app.use('/api/worker', utils.basicAuthWorkers);
app.use('/api/queue', utils.basicAuthWorkers);

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
app.delete('/api/queue/task', bodyParser.json(), (req, res) => queueActions.endTask(req, res, connectedSocketUsers));

app.post('/api/summary/store', bodyParser.json(), (req, res) => textActions.store(req, res));
app.get('/api/user/summary', (req, res) => textActions.getSummary(req, res));
app.get('/api/user/article', (req, res) => textActions.getArticle(req, res));

// Workers Routes
// - Get number of workers
app.get('/api/workers', (req, res) => res.json(connectedWorkers));
// - Get all registered workers
app.get('/api/user/workers', (req, res) => workerActions.get(req, res));
// - Register a new worker
app.post('/api/user/worker', bodyParser.json(), (req, res) => workerActions.register(req, res));
app.delete('/api/user/worker', (req, res) => workerActions.unregister(req, res));
// - Add a new worker
app.post('/api/worker', (req, res) => {
	connectedWorkers++;
	workerActions.add(req, res, connectedSocketUsers)
});
app.delete('/api/worker', (req, res) => {
	connectedWorkers--;
	workerActions.remove(req, res, connectedSocketUsers)
});

// Fallback *Must be the last route*

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './resources/public/index.html')));

// Websocket routes
io.on('connect', (socket) => {
    connectedSocketUsers[socket.id] = socket;
    socket.join('everyone');
    socket.on('pushQueue', data => queueActions.push(socket, data));
    socket.on('disconnect', (reason) => {
        // We delete the user from connected users
        db.Queue.destroy({
            where: {
                uid: socket.id,
                status: 0
            }
        }).then(() => {
            delete connectedSocketUsers[socket.id];
        });
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
