'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ModelPreferences', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            action_left_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ModelActions', key: 'id'
                }
            },
            action_right_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ModelActions', key: 'id'
                }
            },
            score: {
                type: Sequelize.INTEGER
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
        return queryInterface.dropTable('ModelPreferences');
    }
};