var express = require('express');
var router = express.Router();
var config = require('config');

router.get('/', function (req, res) {
    res.render('login');
});

router.post('/', function (req, res) {
    var id = req.body.id;
    var password = req.body.password;

    if (id === config.get('auth.id') && password === config.get('auth.password')) {
        req.session.isAdmin = true;
        res.redirect('back');
    }
    else {
        res.sendStatus(401);
    }
});

module.exports = router;