'use strict';
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Model', {
        name: DataTypes.STRING(20),
        is_automatic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Models',
        timestamps: false
    });
    Model.associate = function (models) {
        Model.ModelActions = Model.hasMany(models.ModelAction, { foreignKey: 'model_id'})
        Model.ModelPreferences = Model.hasMany(models.ModelPreference, { foreignKey: 'model_id'})
    };
    return Model;
};