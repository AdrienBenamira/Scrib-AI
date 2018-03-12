'use strict';
module.exports = (sequelize, DataTypes) => {
    var Metric = sequelize.define('Metric', {
        name: DataTypes.STRING,
        order: DataTypes.INTEGER
    }, {
        timestamps: false,
    });
    return Metric;
};