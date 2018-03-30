'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('ModelPreferences', 'treated', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn('ModelPreferences', 'treated');
    }
};
