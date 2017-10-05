'use strict';
module.exports = (sequelize, DataTypes) => {
    var Category = sequelize.define('Category', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    });
    Category.associate = (models) => {
        Category.Articles = Category.hasMany(models.Article, {foreignKey: 'category_id'});
    };
    return Category;
};