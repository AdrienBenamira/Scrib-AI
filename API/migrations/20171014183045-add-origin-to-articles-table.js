'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      queryInterface.addColumn('Articles', 'origin', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
      });
  },

  down: (queryInterface, Sequelize) => {
      queryInterface.removeColumn('Articles', 'origin');
  }
};
