var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('login');
});

router.post('/', function (req, res) {
    var id = req.body.id;
    var password = req.body.password;
    if (id === '0x44449' && password === '83gnsl!)') {
        req.session.isAdmin = true;
        res.redirect('back');
    }
    else {
        res.sendStatus(401);
    }
});

module.exports = router;