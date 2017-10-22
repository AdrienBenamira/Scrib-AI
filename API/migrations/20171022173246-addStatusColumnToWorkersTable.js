'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('Workers', 'status', {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn('Workers', 'status');
    }
};
