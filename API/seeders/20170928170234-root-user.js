'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/default');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return bcrypt.hash("root", config.security.saltRounds).then((hash) => {
          return queryInterface.bulkInsert('Users', [{
              username: 'root', 
	      createdAt: new Date(),
	      updatedAt: new Date(),
              password: hash, 
          }], {});
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
