'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('Users', 'remember_token', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn('Users', 'remember_token');
    }
};
