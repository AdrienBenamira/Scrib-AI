const config = require('./config/default');
const Sequelize = require('sequelize');

module.exports = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    timezone: config.app.timezone
});

