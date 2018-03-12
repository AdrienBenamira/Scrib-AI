'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Metrics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            order: {
                type: Sequelize.INTEGER
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Metrics');
    }
};