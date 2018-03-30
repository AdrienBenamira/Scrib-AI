'use strict';
module.exports = (sequelize, DataTypes) => {
    var Measurement = sequelize.define('Measurement', {
        graph_step_id: DataTypes.INTEGER,
        value: DataTypes.DOUBLE,
        legend: DataTypes.FLOAT
    }, {
        tableName: "Measurements"
    });
    Measurement.associate = function (models) {
        Measurement.GraphStep = Measurement.belongsTo(models.GraphStep, { foreignKey: 'graph_step_id' });
    };
    return Measurement;
};