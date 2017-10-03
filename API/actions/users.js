const basicAuth = require('basic-auth');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../models');
const config = require('../config/default');


/**
 * Log a user in
 * @param req request object
 * @param res resource object
 */
exports.login = (req, res) => {
// If the username/password of the Basic header is false, this will not return
    const user = basicAuth(req);
    db.User.findOne({
        where: {username: user.name}
    }).then((fetchedUser) => {
        if (fetchedUser !== null) {
            const token = crypto.randomBytes(40).toString('hex');
            fetchedUser.remember_token = token;
            fetchedUser.save().then(() => {
                res.status(200).json({
                    success: true,
                    token
                });
            }).catch(err => res.sendStatus(500));
        } else {
            res.sendStatus(400);
        }
    }).catch((err) => {
        res.sendStatus(500);
    });
};


/**
 * Add a new user
 * @param req
 * @param res
 */
exports.add = (req, res) => {
    // console.log(req.body);
    let {username, password} = req.body;
    // console.log(username, password);
    bcrypt.hash(password, config.security.saltRounds).then((password) => {
        db.User.create({
            username,
            password
        }).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log(err);
            res.status(500).json({success: false})
        });
    }).catch(err => res.status(500).json({success: false}));
};

/**
 * Get all users
 * @param req
 * @param res
 */
exports.get = (req, res) => {
    db.User.findAll().then(fetchedUsers => {
        const users = fetchedUsers.map(user => {
            return {id: user.dataValues.id, username: user.dataValues.username};
        });
        console.log(users);
        res.json(users);
    }).catch(err => {
        res.sendStatus(500);
    });
};

/**
 * Delete user
 * @param req
 * @param res
 */
exports.delete = (req, res) => {
    db.User.findOne({
        where: {
            'username': req.query.username
        }
    }).then(fetchedUser => {
        fetchedUser.destroy().then(() => {
            res.json({success: true}).status(200);
        }).catch(err => {
            res.sendStatus(500);
        });
    }).catch(err => {
        res.sendStatus(500);
    });
};
