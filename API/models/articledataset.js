'use strict';
module.exports = (sequelize, DataTypes) => {
    var ArticleDataset = sequelize.define('ArticleDataset', {
        article_id: DataTypes.INTEGER,
        dataset_id: DataTypes.INTEGER
    }, {
        timestamps: false,
        tableName: 'ArticleDataset'
    });

    return ArticleDataset;
};