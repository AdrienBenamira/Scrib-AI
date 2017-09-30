const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');
const sequelize = require('./db');
const DataTypes = require('sequelize').DataTypes;
const User = require('./models/user')(sequelize, DataTypes);
const moment = require('moment');
const config = require('./config/default');
moment.locale(config.app.timezone);

/**
 * basicAuth
 * @param req
 * @param res
 * @param next
 */
exports.basicAuth = (req, res, next) => {
    // Get login given by the user
    let user = basicAuth(req);
    if (!user) return res.sendStatus(401);
    else {
        // Fetch the user to the database
        User.findOne({
            where: {
                username: user.name
            }
        }).then(fetchedUser => {
            if (fetchedUser !== null) {
                // console.log(fetchedUser.updatedAt);
                const updatedFromNow = moment.duration(moment().diff('2017-09-30 15:43:00')).asDays();
                // If we pass the remember token and it is still valid (
                if (user.pass === fetchedUser.remember_token && 0 < updatedFromNow <= 15) next();
                else {
                    // Compare the hashed password
                    bcrypt.compare(user.pass, fetchedUser.password, (err, result) => {
                        if (!result) {
                            res.sendStatus(401);
                        }
                        else next();
                    });
                }
            } else res.sendStatus(401);
        });
    }
};


