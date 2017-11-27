'use strict';
module.exports = (sequelize, DataTypes) => {
    var Vocabulary = sequelize.define('Vocabulary', {
        word: DataTypes.STRING(50),
        count: DataTypes.INTEGER
    }, {
        timestamps: false,
        tableName: 'Vocabularies'
    });
    return Vocabulary;
};