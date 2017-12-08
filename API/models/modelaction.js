'use strict';
module.exports = (sequelize, DataTypes) => {
    var ModelAction = sequelize.define('ModelAction', {
        content: DataTypes.TEXT,
        model_id: DataTypes.INTEGER,
        article_id: DataTypes.INTEGER,
        treated: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'ModelActions'
    });
    ModelAction.associate = function (models) {
        ModelAction.Model = ModelAction.belongsTo(models.Model, {foreignKey: 'model_id'});
        ModelAction.Article = ModelAction.belongsTo(models.Article, {foreignKey: 'article_id'});
    };
    return ModelAction;
};