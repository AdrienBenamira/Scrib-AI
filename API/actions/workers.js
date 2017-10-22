// const moment = require('moment');
const db = require('../models');
const config = require('../config/default')
const bcrypt = require('bcrypt');

// exports.get = (req, res) => {
//     db.Worker.count({
//         where: {
//             updatedAt: {
//                 $gt: moment().format('YYYY-MM-DD hh:mm:ss'),
//                 $lt: moment().add(3, 'seconds').format('YYYY-MM-DD hh:mm:ss')
//             }
//         }
//     }).then(nbOfWorkers => {
//         res.json(nbOfWorkers);
//     }).catch(() => {
//         res.json(0);
//     });
// };

/**
 * Get all Workers
 * @param req
 * @param res
 */
exports.get = (req, res) => {
  db.Worker.findAll().then(fetchedWorkers => res.json(fetchedWorkers.map(worker => {
      return {name: worker.name, status: worker.status};
  })));
};

/**
 * Register a new worker to database
 * @param req
 * @param res
 */
exports.register = (req, res) => {
  bcrypt.hash(req.body.password, config.security.saltRounds).then((password) => {
	  db.Worker.create({
	      name: req.body.name,
	      password
	  }).then(() => res.sendStatus(200))
	      .catch(() => res.sendStatus(500));
   });
};

/**
 * Remove a worker from database
 * @param req
 * @param res
 */
exports.unregister = (req, res) => {
    db.Worker.destroy({
        where: {
            name: req.query.name
        }
    }).then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
};

exports.add = (io) => {
    console.log('A worker started');
    io.sockets.to('clients').emit('workerAdded');
};

exports.remove = (io) => {
    console.log('A worker went away');
    io.sockets.to('clients').emit('workerRemoved');
};
