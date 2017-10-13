'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Queue', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            payload: {
                type: Sequelize.TEXT('large')
            },
            response: {
                type: Sequelize.TEXT('large'),
                allowNull: true,
                defaultValue: null
            },
            status: {
                type: Sequelize.INTEGER
            },
            room: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('queues');
    }
};