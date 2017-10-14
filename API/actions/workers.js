// const moment = require('moment');
// const db = require('../models');

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
      return {name: worker.name};
  })));
};

/**
 * Register a new worker to database
 * @param req
 * @param res
 */
exports.register = (req, res) => {
  db.Worker.create({
      name: req.body.name,
      password: req.body.password
  }).then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
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

exports.add = (req, res, connectedSocketUsers) => {
    connectedSocketUsers[Object.keys(connectedSocketUsers)[0]].broadcast.to('everyone').emit('workerAdded');
};

exports.remove = (req, res, connectedSocketUsers) => {
    connectedSocketUsers[Object.keys(connectedSocketUsers)[0]].broadcast.to('everyone').emit('workerRemoved');
};
