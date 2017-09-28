const config = require('./config/default');
const utils = require('./utils');
const bcrypt = require('bcrypt');
const sequelize = require('./db');
const DataTypes = require('sequelize').DataTypes;
const User = require('./models/user')(sequelize, DataTypes);
const express = require('express');
const app = express();

// Use the basicAuth middleware for all /user routes
app.use('/user', utils.basicAuth);

// Routes
app.get('/users/login', (req, res) => {
    // If the username/password of the Basic header is false, this will not return
    res.json({success: true});
});

app.post('/user', (req, res) => {
    let {username, password} = req.query;
    bcrypt.hash(password, config.security.saltRounds).then((password) => {
        User.create({
            username,
            password
        }).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log(err);
            res.status(500).json({success: false})
        });
    }).catch(err => res.status(500).json({success: false}));
});

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
