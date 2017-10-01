const fs = require('fs');
const path = require('path');

let config = {
    app: {
        host: "localhost",
        port: 3000,
        timezone: 'Europe/Paris'
    },
     api: {
	host:"http://127.0.0.1:8000/summary",
     },
    security: {
        saltRounds: 10
    },
    database: 'development'
};

config.database = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8'))[config.database];
module.exports = config;

