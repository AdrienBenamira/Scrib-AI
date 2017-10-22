const db = require('../models');

exports.push = (io, socket, data) => {
    console.log('push to queue');
    db.Queue.create({
        payload: JSON.stringify(data.payload),
        status: 0,
        uid: socket.id,
        response: ''
    });
    io.sockets.to('workers').emit('pushQueue');
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
        fetchedQueue.save().then(() => res.json(fetchedQueue))
            .catch(() => res.sendStatus(500));
    }).catch(err => {
        res.sendStatus(500);
    });
};

exports.endTask = (req, res, io) => {
    const clients = Object.keys(io.sockets.connected).filter(id =>
            Object.keys(io.sockets.connected[id].rooms).indexOf('clients') !== -1
    );

    db.Queue.destroy({
        where: {
            id: req.body.id
        }
    }).then(() => {
        const socketName = req.body.type === 'url' ? 'responseTaskUrl' : 'responseTask';
        if (clients.indexOf(req.body.uid) !== -1) {
            if(req.body.error) {
                io.sockets.in(req.body.uid).emit(socketName, {
                    response: req.body.response,
                    message: 'The page does not contain any article.',
                    error: true
                });
            } else {
                io.sockets.in(req.body.uid).emit(socketName, {
                    response: req.body.response,
                    error: false
                });
            }
        }
        res.sendStatus(200);
    }).catch(err => {
        const socketName = req.body.type === 'url' ? 'responseTaskUrl' : 'responseTask';
        if (clients.indexOf(req.body.uid) !== -1) {
            io.sockets.in(req.body.uid).emit(socketName, {
                response: err,
                message: 'Could not delete the task.',
                error: true
            });
        }
        res.sendStatus(500);
    });
};
