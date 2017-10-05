'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('Articles', 'category_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Categories',
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn('Articles', 'category_id');
    }
};
