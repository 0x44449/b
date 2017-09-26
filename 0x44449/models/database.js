var Sequelize = require('sequelize');
var config = require('config');

var sequelize = new Sequelize(
    config.get('connection.database'),
    config.get('connection.user'),
    config.get('connection.password'),
    {
        host: 'localhost',
        dialect: 'mysql'
    });

module.exports = sequelize;