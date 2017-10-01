const cors = require('cors');
const app = require('express')();
const bodyParser = require('body-parser');
const config = require('./config/default');
const utils = require('./utils');
const sequelize = require('./db');
const userActions = require('./actions/users');
const textActions = require('./actions/texts');

// Middlewares

// TODO: configure cors to only allow the interface
app.use(cors());

// Use the basicAuth middleware for all /user routes
app.use('/user', utils.basicAuth);

// Routes

// User routes
// Log a user in
app.get('/user/login', (req, res) => userActions.login(req, res));
// Register a new user
app.post('/user', bodyParser.json(), (req, res) => userActions.add(req, res));

// Text Routes
app.post('/summarization', bodyParser.json(),( req, res) => textActions.summarize(req, res));


// Start application
app.listen(config.app.port, config.app.host, () => {
    console.log(`API listening on port ${config.app.port}`);
    // Try connecting to the database
    sequelize.authenticate()
        .then(() => console.log('Successfully logged to the database'))
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
});
