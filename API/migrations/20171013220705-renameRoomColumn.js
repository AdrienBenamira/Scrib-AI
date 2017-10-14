'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      queryInterface.renameColumn('Queue', 'room', 'uid')
  },

  down: (queryInterface, Sequelize) => {
      queryInterface.renameColumn('Queue', 'uid', 'room')
  }
};
