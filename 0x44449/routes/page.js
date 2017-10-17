var express = require('express');
var router = express.Router();
var config = require('config');
var uuidv4 = require('uuid/v4');
var postModel = require('../models/post-model');
var attachModel = require('../models/attach-model');
var showdown = require('showdown');

showdown.setFlavor('github');
showdown.setOption('tables', true);

var baseViewModel = {
    base: {
        title: 'b.0x449'
    }
};
var viewModel = function(vm) {
    if (typeof vm === 'undefined') {
        return baseViewModel;
    }
    return Object.assign(baseViewModel, vm);
};

router.get('/', async function(req, res) {
    var posts = await postModel.all();
    res.render('index', viewModel({
        posts: posts,
        admin: (req.session && req.session.admin) ? true : false,
        dateformat: require('dateformat')
    }));
});

router.get('/logout', function(req, res) {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('sid');
    }
    res.redirect('/');
});

router.get('/login', function(req, res) {
    if (req.session && req.session.user) {
        res.redirect(req.session.redirect || '/');
    }
    else {
        res.render('login', viewModel());
    }
});

router.post('/login', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;

    if (id === config.get('auth.id') && password === config.get('auth.password')) {
        req.session.user = id;
        req.session.admin = true;
        res.redirect(req.session.redirect || '/');
    }
    else {
        res.sendStatus(401);
    }
});

router.get('/write', function(req, res, next) {
    if (!req.session || !req.session.admin) {
        req.session.redirect = '/write';
        res.redirect('/login');
    }
    else {
        next();
    }
}, function(req, res) {
    res.render('write', viewModel({
        id: uuidv4().toLowerCase()
    }));
});

router.get('/edit/:id', function(req, res, next) {
    if (!req.session || !req.session.admin) {
        req.session.redirect = '/edit/' + req.params.id;
        res.redirect('/login');
    }
    else {
        next();
    }
}, async function(req, res) {
    var id = req.params.id;

    var post = await postModel.findOne({
        where: {
            id: id
        }
    });
    if (post === null) {
        res.sendStatus(404);
    }
    else {
        var attaches = await attachModel.findAll({
            where: {
                id: id
            }
        });
        res.render('edit', viewModel({
            post: post,
            attaches: attaches
        }));
    }
});

router.get('/post/:permalink', async function(req, res) {
    var permalink = decodeURI(req.params.permalink).toLocaleLowerCase();
    var post = await postModel.findOne({
        where: {
            permalink: permalink
        }
    });
    if (post === null) {
        res.sendStatus(404);
    }
    else {
        var converter = new showdown.Converter();
        var html = converter.makeHtml(post.contents);

        res.render('post', viewModel({
            post: post,
            contentsHtml: html,
            admin: (req.session && req.session.admin) ? true : false,
            dateformat: require('dateformat')
        }));
    }
});

router.get('/attach/:id/:name', async function(req, res) {
    var id = req.params.id.toLowerCase();
    var name = req.params.name.toLowerCase();
    var path = id + '/' + name;

    var attach = await attachModel.findOne({
        where: {
            path: path
        }
    });
    if (attach === null) {
        res.sendStatus(404);
    }
    else {
        res.contentType(attach.type);
        res.end(attach.data);
    }
});

module.exports = router;