'use strict';
module.exports = (sequelize, DataTypes) => {
    var ModelPreference = sequelize.define('ModelPreference', {
        action_left_id: DataTypes.INTEGER,
        action_right_id: DataTypes.INTEGER,
        score: DataTypes.INTEGER,
        model_id: DataTypes.INTEGER
    }, {
        tableName: 'ModelPreferences'
    });
    ModelPreference.associate = function (models) {
        ModelPreference.ModelActionLeft = ModelPreference.belongsTo(models.ModelAction, { foreignKey: 'action_left_id'});
        ModelPreference.ModelActionRight = ModelPreference.belongsTo(models.ModelAction, { foreignKey: 'action_right_id'});
        ModelPreference.Model = ModelPreference.belongsTo(models.Model, { foreignKey: 'model_id'});
    };
    return ModelPreference;
};