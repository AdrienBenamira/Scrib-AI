'use strict';
module.exports = (sequelize, DataTypes) => {
    var Graph = sequelize.define('Graph', {
        name: DataTypes.STRING,
        model_id: DataTypes.INTEGER
    }, {
        tableName: 'Graphs',
        timestamps: false
    });
    Graph.associate = function (models) {
        Graph.GraphSteps = Graph.hasMany(models.GraphStep, { foreignKey: 'graph_id' });
        Graph.Model = Graph.belongsTo(models.Model, { foreignKey: 'model_id' });
    };
    return Graph;
};