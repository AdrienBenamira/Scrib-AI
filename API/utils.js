const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');
const sequelize = require('./db');
const DataTypes = require('sequelize').DataTypes;
const User = require('./models/user')(sequelize, DataTypes);

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
            if(fetchedUser !== null) {
                // Compare the hashed password
                bcrypt.compare(user.pass, fetchedUser.password, (err, result) => {
                    if (!result) res.sendStatus(401);
                    else next();
                });
            } else res.sendStatus(401);
        });
    }
};
