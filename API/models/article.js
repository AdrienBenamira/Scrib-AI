'use strict';
module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define('Article', {
        fullText: {
            type: DataTypes.TEXT('long'),
            validate:{
                notEmpty: true,
                len: [500]
            }
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                isUrl: true
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                Article.hasMany(models.Summary, {
                    foreignKey: 'article_id',
                    sourceKey: 'id'
                });
            }
        }
    });
    return Article;
};