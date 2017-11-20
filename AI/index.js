const io = require('socket.io-client');
const pythonShell = require('python-shell');
const config = require('./config/default.json');

let numberOfElementInQueue = 0;
let runningScript = false;

const socket = io('http://' + config.host + ':' + config.port, {
    query: {
        type: 'worker',
        name: config.auth.name,
        password: config.auth.password
    }
});

socket.on('connect', () => {
    console.log('Awaiting for something to sum up...');
    runModel();
});

socket.on('pushQueue', (size = null) => {
    if(size !== null) numberOfElementInQueue = size;
    else numberOfElementInQueue ++;
    if(!runningScript && numberOfElementInQueue > 0) runModel();
});

const runModel = () => {
    if(numberOfElementInQueue > 0) {
        runningScript = true;
        console.log('Summarizing');
        pythonShell.run('main.py', {
            pythonPath: config.pythonPath
        }, (err, results) => {
            if (err) console.log('Error: ', err);
            else {
                numberOfElementInQueue --;
                console.log(results);
                if(numberOfElementInQueue > 0) {
                    runModel();
                }
            }
            runningScript = false;
            console.log('Awaiting for something to sum up...');
        });
    }
};
