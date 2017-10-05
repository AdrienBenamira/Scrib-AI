'use strict';
module.exports = (sequelize, DataTypes) => {
    var ArticleKeyword = sequelize.define('ArticleKeyword', {
        article_id: DataTypes.INTEGER,
        keyword_id: DataTypes.INTEGER
    }, {
        tableName: 'ArticleKeyword',
        timestamps: false
    });
    return ArticleKeyword;
};