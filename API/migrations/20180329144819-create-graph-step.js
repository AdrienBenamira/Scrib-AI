'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.createTable('GraphSteps', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            graph_id: {
                type: Sequelize.INTEGER
            }
        });
        return queryInterface.renameColumn("Measurements", "graph_id", "graph_step_id");
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('GraphSteps');
        return queryInterface.renameColumn("Measurements", "graph_step_id", "graph_id");
    }
};