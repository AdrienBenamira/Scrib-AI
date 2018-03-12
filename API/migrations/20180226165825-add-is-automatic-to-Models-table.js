'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('Models', 'is_automatic', {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        });
    },

    down: (queryInterface) => {
        queryInterface.removeColumn('Models', 'is_automatic');
    }
};
