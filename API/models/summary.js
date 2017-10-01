'use strict';
module.exports = (sequelize, DataTypes) => {
    const Summary = sequelize.define('Summary', {
        content: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
        article_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: 'Articles',
            referenceKey: 'id'
        },
        is_generated: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Summary.belongsTo(models.Article, {
                    foreignKey: 'article_id',
                    targetKey: 'id'
                });

                Summary.hasMany(models.Grade, {
                    foreignKey: 'summary_id',
                    sourceKey: 'id'
                });
            }
        }
    });
    return Summary;
};