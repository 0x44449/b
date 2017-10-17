var express = require('express');
var router = express.Router();
var postModel = require('../models/post-model');
var uuidv4 = require('uuid/v4');
var Sequelize = require('sequelize');
var multer = require('multer');
var attachModel = require('../models/attach-model');

const Op = Sequelize.Op;
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/api/post/add', function(req, res, next) {
    if (!req.session || !req.session.admin) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}, async function(req, res) {
    var post = req.body;
    post.id = post.id || uuidv4().toLowerCase();
    post.author = req.session.user;
    post.created = new Date();
    post.modified = new Date();
    post.permalink = post.permalink.toLowerCase();

    var permalinkCheck = await postModel.count({
        where: {
            permalink: post.permalink
        }
    });

    if (permalinkCheck > 0) {
        res.send({ ok: false, reason: 'permalink already exists' });
    }
    else {
        await postModel.create(post);
        res.send({ ok: true });
    }
});

router.post('/api/post/delete', function(req, res, next) {
    if (!req.session || !req.session.admin) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}, async function(req, res) {
    var id = req.body.id;

    await postModel.destroy({
        where: {
            id: id
        }
    });

    await attachModel.destroy({
        where: {
            id: id
        }
    });

    res.send({ ok: true });
});

router.post('/api/post/edit', function(req, res, next) {
    if (!req.session || !req.session.admin) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}, async function(req, res) {
    var post = req.body;
    post.permalink = post.permalink.toLowerCase();
    var id = post.id;

    var permalinkCheck = await postModel.count({
        where: {
            permalink: post.permalink,
            id: {
                $not: id
            }
        }
    });

    if (permalinkCheck > 0) {
        res.send({ ok: false, reason: 'permalink already exists' });
    }
    else {
        await postModel.update({
            category: post.category,
            title: post.title,
            contents: post.contents,
            modified: new Date(),
            permalink: post.permalink,
            tags: post.tags
        }, {
            where: {
                id: id
            }
        });
        res.send({ ok: true });
    }
});

router.post('/api/attach/upload/:id', upload.any(), function(req, res, next) {
    if (!req.session || !req.session.admin) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}, async function(req, res) {
    var id = req.params.id.toLowerCase();
    var files = req.files;
    var result = [];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        var path = id + '/' + file.originalname.toLowerCase();
        var attach = {
            path: path,
            id: id,
            type: file.mimetype,
            size: file.size,
            data: file.buffer
        };
        await attachModel.create(attach);

        result.push({
            path: path
        });
    }

    res.send({ ok: true, result: result });
});

router.post('/api/attach/delete/:id/:name', function(req, res, next) {
    if (!req.session || !req.session.admin) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}, async function(req, res) {
    var path = req.params.id.toLowerCase() + '/' + req.params.name.toLowerCase();

    await attachModel.destroy({
        where: {
            path: path
        }
    });

    res.send({ ok: true });
});

module.exports = router;