'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ArticleDataset', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            article_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Articles', key: 'id'
                }
            },
            dataset_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Datasets', key: 'id'
                }
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ArticleDataset');
    }
};