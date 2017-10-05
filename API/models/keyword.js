'use strict';
module.exports = (sequelize, DataTypes) => {
  var Keyword = sequelize.define('Keyword', {
    name: DataTypes.STRING
  }, {
    timestamps:false
  });
  Keyword.associate = (models) => {
    Keyword.Articles = Keyword.belongsToMany(models.Article, {through: 'ArticleKeyword', foreignKey: 'keyword_id'});
  };
  return Keyword;
};