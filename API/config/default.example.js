const fs = require('fs');
const path = require('path');

let config = {
    app: {
        host: "localhost",
        port: 3000,
        timezone: 'Europe/Paris'
    },
    security: {
        saltRounds: 10
    },
    database: 'development'
};

config.database = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8'))[config.database];
module.exports = config;

