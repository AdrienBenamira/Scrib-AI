'use strict';
module.exports = (sequelize, DataTypes) => {
    var GraphStep = sequelize.define('GraphStep', {
        name: DataTypes.STRING,
        graph_id: DataTypes.INTEGER
    }, {
        timestamps: false,
        tableName: "GraphSteps"
    });
    GraphStep.associate = function (models) {
        GraphStep.Measurements = GraphStep.hasMany(models.Measurement, { foreignKey: 'graph_step_id' });
        GraphStep.Graph = GraphStep.belongsTo(models.Graph, { foreignKey: 'graph_id' });
    };
    return GraphStep;
};