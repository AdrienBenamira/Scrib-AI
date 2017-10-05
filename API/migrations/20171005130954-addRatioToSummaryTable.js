'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('Summaries', 'ratio', {
            type: Sequelize.INTEGER
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn('Summaries', 'ratio');
    }
};
