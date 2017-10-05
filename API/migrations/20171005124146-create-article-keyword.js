'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ArticleKeyword', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            }, article_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Articles', key: 'id'
                }
            }, keyword_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Keywords', key: 'id'
                }
            }
        });
    }, down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ArticleKeyword');
    }
};