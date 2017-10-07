'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('Articles', 'title', {
            type: Sequelize.STRING(20),
            allowNull: true,
            defaultValue: null
        });
        queryInterface.addColumn('Articles', 'author', {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: null
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn('Articles', 'title');
        queryInterface.removeColumn('Articles', 'author');
    }
};
