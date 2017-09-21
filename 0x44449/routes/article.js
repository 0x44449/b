var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/article/:index(\d+)', function (req, res) {
    res.render('index', { title: 'Express' });
});

module.exports = router;