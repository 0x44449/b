var database = require('./database');
var Sequelize = require('sequelize');

var attach = database.define('attach', {
    path: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    id: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    size: {
        type: Sequelize.INTEGER
    },
    data: {
        type: Sequelize.BLOB('medium')
    }
}, {
    timestamps: false
});

module.exports = attach;