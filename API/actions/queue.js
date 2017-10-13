const statsSummaryQueries = require('./statsSummaryQueries');
const statsArticleQueries = require('./statsArticleQueries');
const axios = require('axios');
const config = require('../config/default');
const db = require('../models');

exports.push = (socket, data) => {
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
    db.Queue.delete({
        where: {
            id: req.body.id
        }
    }).then(() => {
        connectedUser[req.body.uid].emit('responseTask', req.body.response);
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    });
};
