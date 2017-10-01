'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Summaries', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.TEXT('medium'),
                allowNull: false
            },
            article_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Articles',
                    key: 'id'
                },
            },
            is_generated: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
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
        return queryInterface.dropTable('Summaries');
    }
};