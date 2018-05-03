const io = require('socket.io-client');
const pythonShell = require('python-shell');
const config = require('./config/default.json');

let queue = [];
let runningScript = false;
let metricResults = [{}, {}];

const dispatch = () => {
    if(!runningScript && queue.length > 0) {
        const type = queue.shift(); 
        switch(type){
            case 'summary':
                runModel();
                break;
            case 'execMetric':
                runExecMetric();
                break;
        }
    }
};

const socket = io('http://' + config.host + ':' + config.port, {
    query: {
        type: 'worker',
        name: config.auth.name,
        password: config.auth.password
    }
});

socket.on('connect', () => {
    console.log('Awaiting for something to sum up...');
    dispatch();
});

socket.on('pushQueue', (size = null) => {
    if(size !== null) {
        // Puting just the number of summary needed
        queue = queue.filter(type => type !== 'summary');
        queue = [...queue, Array(size).fill('summary')];
    }
    else {
        queue.push('summary');
    }
    dispatch();
});

/**
 * A new summary has been produced
 */
socket.on('execMetricRequest', () => {
    queue.push('execMetric');
    dispatch();
});

/**
 * List of metrics sent
 */
socket.on('execMetric', (metrics, actions) => {
    metricResults = [{}, {}];
    actions.forEach((action, k) => {
        metrics.forEach(metric => {
            console.log('Executing ' + metric.name + ' metric.');
            pythonShell.run('metrics/' + metric.name + '_metric.py', {
                pythonPath: config.pythonPath,
                mode: "text",
                args: [action.Article.fullText, action.content]
            }, (err, results) => {
                if (err) console.log('Error: ', err);
                else {
                    console.log(JSON.parse(results))
                    metricResults[k][metric.name] = {order: metric.order, output: JSON.parse(results[0])};
                    if(Object.keys(metricResults[0]).length + Object.keys(metricResults[1]).length === 2 * metrics.length) {
                        runSendMetricResults(actions);
                    }
                }
                console.log('Metric ' + metric.name + ' executed.');
            });
        });
    });
});

// If no execution in the end
socket.on('execMetricCancelled', () => {
    runningScript = false;
    dispatch();
});

const runModel = () => {
    if(queue.length > 0) {
        runningScript = true;
        console.log('Summarizing');
        pythonShell.run('main.py', {
            pythonPath: config.pythonPath
        }, (err, results) => {
            runningScript = false;
            if (err) console.log('Error: ', err);
            else {
                // Remove on summary from the queue
                queue.splice('summary', 1);
                console.log(results);
                if(queue.length > 0) {
                    dispatch();
                }
            }
            console.log('Awaiting for something to sum up...');
        });
    }
};

const runExecMetric = () => {
    runningScript = true;
    socket.emit('execMetricReady');
};

const runSendMetricResults = (actions) => {
    socket.emit('saveAutoPreference', {
        results: metricResults,
        model_id: actions[0].model_id,
        action_left: actions[0].id,
        action_right: actions[1].id
    });
    runningScript = false;
    dispatch();
};
