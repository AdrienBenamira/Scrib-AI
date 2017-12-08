'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ModelActions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.TEXT('medium')
            },
            model_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Models', key: 'id'
                }
            },
            article_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Articles', key: 'id'
                }
            },
            treated: {
                type: Sequelize.INTEGER,
                defaultValue: 0
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
        return queryInterface.dropTable('ModelActions');
    }
};