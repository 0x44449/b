var express = require('express');
var router = express.Router();
var postModel = require('../models/post-model');
var uuidv4 = require('uuid/v4');

router.post('/api/post/add', function(req, res, next) {
    if (!req.session || !req.session.admin) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}, async function(req, res) {
    var post = req.body;
    post.id = uuidv4().toLowerCase();
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
            permalink: post.permalink
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
            tags: post.tags
        }, {
            where: {
                id: id
            }
        });
        res.send({ ok: true });
    }
});

module.exports = router;