const bcrypt = require('bcrypt');
const config = require('./config/default');
const user = require('./models/users');

user.sync({force: true}).then(() => {
    bcrypt.hash('root', config.security.saltRounds).then(hash => {
        use.create({
            username: 'root',
            password: hash
        });
        console.log('Default user root added.');
    });
    console.log('users table added.');
});