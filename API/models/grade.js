'use strict';
module.exports = (sequelize, DataTypes) => {
    const Grade = sequelize.define('Grade', {
        summary_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: 'Summaries',
            referenceKey: 'id'
        },
        grade: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
            validate: {
                min: 0, max: 5
            }
        },
        is_incorrect: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    Grade.associate = function (models) {
        Grade.Summary = Grade.belongsTo(models.Summary, {
            foreignKey: 'summary_id',
            targetKey: 'id'
        })
    };

    return Grade;
};