'use strict';
module.exports = (sequelize, DataTypes) => {
    const Summary = sequelize.define('Summary', {
        content: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
        is_generated: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    Summary.associate = function (models) {
        Summary.Article = Summary.belongsTo(models.Article, {
            foreignKey: 'article_id'
        });

        Summary.Grades = Summary.hasMany(models.Grade, {
            foreignKey: 'summary_id'
        });
    };

    return Summary;
};