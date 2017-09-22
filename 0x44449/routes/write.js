var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (!req.session.isAdmin) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}, function (req, res) {
    res.render('write');
});

module.exports = router;