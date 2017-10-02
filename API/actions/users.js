const basicAuth = require('basic-auth');
const crypto = require('crypto');
const db = require('../models');
const User = require('../models/user')(db.sequelize, db.Sequelize.DataTypes);


/**
 * Log a user in
 * @param req request object
 * @param res resource object
 */
exports.login = (req, res) => {
// If the username/password of the Basic header is false, this will not return
    const user = basicAuth(req);
    User.findOne({
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
    console.log(req.body);
    // let {username, password} = req.query;
    // bcrypt.hash(password, config.security.saltRounds).then((password) => {
    //     User.create({
    //         username,
    //         password
    //     }).then(() => {
    //         res.json({success: true});
    //     }).catch(err => {
    //         console.log(err);
    //         res.status(500).json({success: false})
    //     });
    // }).catch(err => res.status(500).json({success: false}));
};
