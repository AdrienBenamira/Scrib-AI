'use strict';
module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define('Article', {
        fullText: {
            type: DataTypes.TEXT('long'),
            // validate:{
            //     notEmpty: true,
            //     len: [400]
            // }
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            // validate: {
            //     isUrl: true
            // }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        author: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
    }, {
        tableName: 'Articles'
    });

    Article.associate = function (models) {
        Article.Summaries = Article.hasMany(models.Summary, {
            foreignKey: 'article_id',
        });
        Article.Category = Article.belongsTo(models.Category, {foreignKey: 'category_id'});
        Article.Keywords = Article.belongsToMany(models.Keyword, {through: 'ArticleKeyword', foreignKey: 'article_id'});
        Article.Datasets = Article.belongsToMany(models.Dataset, {through: 'ArticleDataset', foreignKey: 'article_id'});
    };
    return Article;
};