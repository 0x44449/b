var database = require('./database');
var Sequelize = require('sequelize');

var post = database.define('post', {
    seq: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: {
        type: Sequelize.STRING
    },
    category: {
        type: Sequelize.STRING
    },
    title: {
        type: Sequelize.STRING
    },
    contents: {
        type: Sequelize.TEXT
    },
    author: {
        type: Sequelize.STRING
    },
    created: {
        type: Sequelize.DATE
    },
    modified: {
        type: Sequelize.DATE
    },
    tags: {
        type: Sequelize.STRING
    },
    permalink: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});

module.exports = post;