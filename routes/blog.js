const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const fs = require('fs');
const md = require('markdown-it')();
const path = require('path')
const getPosts = require('./functions/post');

/* GET home page. */

router.get('/', function(req, res, next) {
    let posts = getPosts()
    console.log(posts);
    res.render('blog/index', {posts: posts});
}); 
router.post('/api', function(req, res, next) {
    let bodyJson = req.body;
    let config = JSON.parse(fs.readFileSync(path.resolve(__dirname,"../config.json")))
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/data/posts.json")))
    if (!config.secrets.some(val => val.key === bodyJson.secret)) return res.sendStatus(401)
    if (data.body.some(val => val.name === bodyJson.body.name)) return res.sendStatus(304)
    bodyJson.body.date = Date.now()
    bodyJson.body.author = config.secrets.find(val => val.key === bodyJson.secret).author
    data.body.push(bodyJson.body)
    fs.writeFileSync(path.resolve(__dirname, "../public/data/posts.json"), JSON.stringify(data, null, 4))
    res.sendStatus(201)
});

function toDateString(date) {
    date = new Date(date)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}
router.get('/posts/*', function(req, res, next) {
    let url = req.path.replace("/posts/", "")
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/data/posts.json")))
    data = data.body
    let post = data.find(val => val.date == url)
    if (!post) return res.sendStatus(404)
    let topic = post.name
    let content = post.content

    let readable = toDateString(post.date)
    res.render('blog/post', {topic: topic, content: content, date: readable, author: post.author, markdown: md})
});
router.get('/send', function(req, res, next) {
    res.render('blog/send');
});
module.exports = router;
