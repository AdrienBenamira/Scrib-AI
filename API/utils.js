const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');

/**
 * basicAuth
 * @param req
 * @param res
 * @param next
 */
exports.basicAuth = (req, res, next) => {
    console.log("basic Auth");
    //TODO: Find username/password in database
    let username = 'root';
    let password = '$2a$10$icT47lGzFZrutfHhRIyut.tuRlIhOrbhxcnIzk/1EqdpqTJgSuzWq'; // root
    let user = basicAuth(req);
    // Compare password with bcrypt
    let isValid = true;
    if (!user || user.name !== username) {
        isValid = false;
    }else {
        bcrypt.compare(user.pass, password, (err, result) => {
            if (!result) isValid = false;
        });
    }
    if(!isValid) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }
    console.log(isValid);
    next();
};
