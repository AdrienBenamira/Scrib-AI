'use strict';
module.exports = (sequelize, DataTypes) => {
    var Dataset = sequelize.define('Dataset', {
        name: DataTypes.STRING(20)
    }, {
        timestamps: false,
        tableName: 'Datasets'
    });
    Dataset.associate = function (models) {
        Dataset.Articles = Dataset.belongsToMany(models.Article, {through: 'ArticleDataset', foreignKey: 'dataset_id'});
    };
    return Dataset;
};