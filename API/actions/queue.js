const db = require('../models');

exports.push = (socket, data) => {
    console.log('pushed');
    console.log(data);
    db.Queue.create({
        payload: JSON.stringify(data.payload),
        status: 0,
        uid: socket.id,
        response: ''
    });
};

exports.getLast = (req, res) => {
    db.Queue.findOne({
        where: {
            status: 0
        },
        order: [
            ['createdAt', 'ASC']
        ]
    }).then(fetchedQueue => {
        fetchedQueue.status = 1;
        fetchedQueue.save().then(() => res.json(fetchedQueue));
    }).catch(err => {
        res.sendStatus(500);
    });
};

exports.endTask = (req, res, connectedUser) => {
    console.log('sendResponse');
    db.Queue.destroy({
        where: {
            id: req.body.id
        }
    }).then(() => {
        const socketName = req.body.type === 'url' ? 'responseTaskUrl' : 'responseTask';
        console.log(connectedUser);
        console.log(req.body.uid);
        connectedUser[req.body.uid].emit(socketName, {
            response: req.body.response,
            error: false
        });
        res.sendStatus(200);
    }).catch(err => {
        const socketName = req.body.type === 'url' ? 'responseTaskUrl' : 'responseTask';
        connectedUser[req.body.uid].emit(socketName, {
            response: err,
            message: 'Could not delete the task.',
            error: true
        });
        res.sendStatus(500);
    });
};
