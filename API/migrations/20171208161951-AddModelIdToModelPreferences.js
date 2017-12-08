'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      queryInterface.addColumn('ModelPreferences', 'model_id', {
          type: Sequelize.INTEGER,
          references: {
              model: 'Models',
              key: 'id'
          },
      });
  },

  down: (queryInterface, Sequelize) => {
      queryInterface.removeColumn('ModelPreferences', 'model_id');
  }
};
