'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('Measurements', 'legend', {
            type: Sequelize.DataTypes.FLOAT
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn('Measurements', 'legend');
    }
};
