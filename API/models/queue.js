'use strict';
module.exports = (sequelize, DataTypes) => {
  var queue = sequelize.define('Queue', {
    payload: DataTypes.TEXT,
    response: DataTypes.TEXT,
    status: DataTypes.INTEGER,
    room: DataTypes.STRING
  }, {
      tableName: 'Queue'
  });
  return queue;
};