const { request } = require('express');
const auth = require('./auth');
const schema = require('./schema');
const uploadImage = require('./uploadCloudinary');
const mongoose = require('mongoose');
const Article = mongoose.model('article', schema.articleSchema);
const Profile = mongoose.model('profile', schema.profileSchema);
const connectionString = process.env.CONNECTION_STRING;
const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

async function createArticle(pid, author, text, img) {
    let date = new Date();
    let comments = [];
    if (!img) return new Article({pid,author,text,date,comments}).save();
    return new Article({
        pid,
        author,
        text,
        date,
        comments,
        image:img
    }).save()
    
}

async function getArticleOwner(pid) {
    return await connector.then(async () => {
        let article = await Article.findOne({pid: pid});
        return article;
    });
}

async function getUsersToQuery(username) {
    return await connector.then(async () => {
        let userObj = await Profile.findOne({ username });
        if (!userObj) return [username];
        return [userObj.username, ...userObj.following];
    });
}
async function findArticlesByAuthors(query) {
    return await connector.then(async () => {
        return await Article.find(query).sort({pid: -1})
    });
}
async function findProfilesByUsers(username) {
    return await connector.then(async () => {
        let userObj = await Profile.findOne({ username });
        if (!userObj) return {};
        return await Profile.find({username: {$in: userObj.following}});
    });
}
async function update(id, query) {
    return await connector.then(async () => {
        return await Article.findOneAndUpdate({ pid: id }, query, { new: true } );
    });
}

const getArticles = (req, res) => {
    let id = req.params.id;
    // console.log(req.user['name']);
    (async () => {
        const usersToQuery = await getUsersToQuery(req.username);
    
        if (!id) {
            let articles = await findArticlesByAuthors({author: {$in: usersToQuery}});
            res.send({ articles: articles});
        } else {
            let pid = parseInt(id);
            if (isNaN(pid)) {
                let articles = await findArticlesByAuthors({author: id});
                res.send({ articles: articles});
            } else {
                let articles = await findArticlesByAuthors({pid: pid});
                res.send({ articles: articles});
            }
        }
    })();
}

const addArticle = (req, res) => {
    let text = req.body.text;
    (async () => {
        const usersToQuery = await getUsersToQuery(req.username);
        let len = (await Article.find()).length;
        await createArticle(len + 1, req.username, text, null);
        let articles = await findArticlesByAuthors({author: {$in: usersToQuery}});
        res.send({ articles: articles});
    })();
}
const postArticle = (req, res) => {
    let text = req.body.text;
    let img = req.fileurl;
    (async () => {
        const usersToQuery = await getUsersToQuery(req.username);
        let len = (await Article.find()).length;
        await createArticle(len + 1, req.username, text, img);
        let articles = await findArticlesByAuthors({author: {$in: usersToQuery}});
        res.send({ articles: articles});
    })();
}
const updateArticles = (req, res) => {
    let id = parseInt(req.params.id);
    let text = req.body.text;
    let commentId = req.body.commentId;
    
    (async () => {
        if(commentId != null) {
            if (commentId === -1) {
                await update(id, { $push: {comments: {author:req.username, text: text}}});
            } else {
                let article = await getArticleOwner(id);
                if (article.comments[commentId].author !== req.username) {
                    res.sendStatus(403);
                    return;
                }
                await connector.then(async () => {
                    await Article.updateOne({ pid: id }, { $set: { [`comments.${commentId}`]: {author:req.username, text: text} } } );
                });
            }
        } else {
            let article = await getArticleOwner(id);
            if (article.author !== req.username) {
                res.sendStatus(403);
                return;
            }
            await update(id, {text: text});
        }
        const usersToQuery = await getUsersToQuery(req.username);
        let articles = await findArticlesByAuthors({author: {$in: usersToQuery}});
        res.send({ articles: articles});
    })();
    // res.send({ articles: [{ id: 1, author: req.username, text: "Dummy article", date: new Date(), comments: ["dummy"] }]});
}

const getFollowProfiles = (req, res) => {
    (async () => {
        let following = await findProfilesByUsers(req.username);
        res.send({ following: following});
    })();
}
module.exports = (app) => {
    app.get('/articles/:id?', auth.isLoggedIn, getArticles);
    app.put('/articles/:id', auth.isLoggedIn, updateArticles);
    app.post('/article', auth.isLoggedIn, addArticle);
    app.post('/post', auth.isLoggedIn, uploadImage('postImage'), postArticle);
    app.get('/followprofile', auth.isLoggedIn, getFollowProfiles);
}