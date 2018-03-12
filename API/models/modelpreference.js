'use strict';
module.exports = (sequelize, DataTypes) => {
    var ModelPreference = sequelize.define('ModelPreference', {
        action_left_id: DataTypes.INTEGER,
        action_right_id: DataTypes.INTEGER,
        score: DataTypes.INTEGER,
        model_id: DataTypes.INTEGER,
        treated: DataTypes.INTEGER
    }, {
        tableName: 'ModelPreferences'
    });
    ModelPreference.associate = function (models) {
        ModelPreference.ModelActionLeft = ModelPreference.belongsTo(models.ModelAction,
            { 
                foreignKey: 'action_left_id',
                as: 'action_left'
            }
        );
        ModelPreference.ModelActionRight = ModelPreference.belongsTo(models.ModelAction, 
            {
                foreignKey: 'action_right_id',
                as: 'action_right'
            }
        );
        ModelPreference.Model = ModelPreference.belongsTo(models.Model, { foreignKey: 'model_id'});
    };
    return ModelPreference;
};
