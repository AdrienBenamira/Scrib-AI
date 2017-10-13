module.exports = {
    app: {
        host: "localhost",
        port: 3000,
        timezone: 'Europe/Paris'
    },
    interface: {
        host: 'localhost',
        port: '8080'
    },
    summary: {
        minCharacter: 0
    },
    api: {
        host: "http://127.0.0.1:8000/summary",
    },
    security: {
        saltRounds: 10
    }
};
