'use strict';
module.exports = (sequelize, DataTypes) => {
    var Worker = sequelize.define('Worker', {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        status: DataTypes.BOOLEAN
    });
    return Worker;
};