const md5 = require('md5');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let sessionUser = {};
let cookieKey = "sid";
const mongoose = require('mongoose');
const { resolvePath } = require('react-router-dom');
const schema = require('./schema');
const User = mongoose.model('user', schema.userSchema);
const Profile = mongoose.model('profile', schema.profileSchema);
const Article = mongoose.model('article', schema.articleSchema);
const connectionString = process.env.CONNECTION_STRING;

function genSaltedHash(password, salt) {
    return md5(password + salt);
}

async function createUser(username, password) {
    let salt = username + new Date().getTime();
    let hash = genSaltedHash(password, salt);
    return new User({
        username,
        salt,
        hash
    }).save()
}

async function createProfile(username, email, zipcode, dob, phone) {
    let headline = "This is my headline!";
    let following = [];
    let picture = "https://bootdey.com/img/Content/avatar/avatar6.png";
    return new Profile({
        username,
        headline,
        email,
        zipcode,
        phone,
        dob,
        following,
        picture
    }).save()
}

async function getUser(query) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    return await connector.then(async () => {
        return await User.findOne(query)
    });
}

function isLoggedIn(req, res, next) {
    // likely didn't install cookie parser
    if (!req.cookies) {
       return res.sendStatus(401);
    }
    let sid = req.cookies[cookieKey];
    
    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }

    let user = sessionUser[sid];

    // no username mapped to sid
    if (user) {
        req.username = user.username;
        next();
    }
    else {
        return res.sendStatus(401)
    }
}
let oauthUser;
function oauthLogin(req, res) {
    if (oauthUser == undefined) {
        res.sendStatus(401);
        return;
    }
    sessionUser[oauthUser.token] = oauthUser;
    res.cookie(cookieKey, oauthUser.token, { maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true });
    res.send(JSON.stringify({result: 'success'}));
}
function linkAccount(req, res) {
    let sid = req.cookies[cookieKey];
    // logged in second time
    let userObj = sessionUser[sid];
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        await connector.then(async () => {
            await User.deleteOne({username: oauthUser.username, thirdPartyId: oauthUser.id});
            await User.updateOne({ hash: userObj.hash }, {thirdPartyId: oauthUser.id});
            let oauthProfile = await Profile.find({username: oauthUser.username, email: oauthUser.email});
            if (oauthProfile.length == 1) {
                await Profile.updateOne({ username: userObj.username }, { $addToSet: { following: { $each: oauthProfile[0].following } }, email: oauthUser.email });
                await Profile.deleteOne({username: oauthUser.username, email: oauthUser.email});
            }
            await Article.updateMany({author: oauthUser.username}, { $set: { author: userObj.username }});
            await Article.updateMany({"comments.author": oauthUser.username }, { $set: { "comments.$.author": userObj.username }});
            res.send(JSON.stringify({result: 'success'}));
        });
    })();
}
function unLinkAccount(req, res) {
    (async () => {
        await User.updateOne({ username: req.username }, {$unset: {thirdPartyId:""}});
        res.send(JSON.stringify({result: 'success'}));
    })();
}
function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    
    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    (async () => {
        const userObj = await getUser({username});
        
        if (!userObj) {
            return res.sendStatus(401)
        }
            
        let hash = genSaltedHash(password, userObj.salt);
        if (hash === userObj.hash) {
            // "security by obscurity" we don't want people guessing a sessionkey
            const sessionKey = md5("meth" + new Date().getTime() + userObj.username)
            sessionUser[sessionKey] = userObj
            let auth = userObj.thirdPartyId ? true : false;
            res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true });
            let msg = JSON.stringify({username: username, result: 'success', auth: auth});
            res.send(msg);
        }
        else {
            res.sendStatus(401);
        }
    })();
    
}

function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let zipcode = req.body.zipcode;
    let dob = req.body.dob;
    let phone = req.body.phone? req.body.phone: "111-222-3333";

    // supply username and password
    if (!username || !password || !email || !zipcode || !dob) {
        return res.sendStatus(400);
    }
    
    (async () => {
        const userObj = await getUser({username});
        if (userObj) {
            return res.sendStatus(409);
        }
        
        await createUser(username, password);
        await createProfile(username, email, zipcode, dob, phone);
        res.send({ result: 'success', username: username});
    })();
}

function logout(req, res) {
    if (req.isAuthenticated()) {
        req.session.destroy();
    } else {
        let sid = req.cookies[cookieKey];
        delete sessionUser[sid];
        res.clearCookie(cookieKey);
    }
    res.sendStatus(200);
}

const updatePassword = (req, res) => {
    let username = req.username;
    let password = req.body.password;
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        await connector.then(async () => {
            let salt = username + new Date().getTime();
            let hash = genSaltedHash(password, salt);
            await User.UpdateOne({ username }, { hash: hash, salt: salt });
        });
        res.send({ username: req.username, result: 'success' });
    })();
     
}
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: '322684693411-ivpjvee1nlavu2hmhi44tucvandmvpl9.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://yk66-final-backend.herokuapp.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    let user = {
          'email': profile.emails[0].value,
          'name' : profile.name.givenName + ' ' + profile.name.familyName,
          'id'   : profile.id,
          'token': accessToken
    };

    oauthUser = {...user, username: user['name']};
    (async () => {
        const userObj = await getUser({thirdPartyId: user['id']});
        if (!userObj) {
            await new User({
                username: user['name'],
                thirdPartyId: user['id']
            }).save();
            await createProfile(user['name'], user['email'], 12345, Date.now(), '111-111-1111');
        } else if ('hash' in userObj){
            oauthUser = {...oauthUser, username: userObj.username};
        }
        done(null, user);
    })();
})
);
const auth = (app) => {

    app.use(session({
        secret: 'doNotGuessTheSecret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login', login);
    app.post('/register', register);
    app.get('/auth/login', oauthLogin);
    app.put('/password', isLoggedIn, updatePassword);
    app.put('/logout', isLoggedIn, logout);
    app.get('/link', isLoggedIn, linkAccount);
    app.get('/unlink', isLoggedIn, unLinkAccount);
    app.get('/auth/google', passport.authenticate('google',{ scope: ["profile", "email"] }));
    app.get('/auth/google/callback', 
    passport.authenticate('google', { successRedirect: 'https://yk66.surge.sh/login',
    failureRedirect: '/' }));
};

module.exports = {isLoggedIn, auth};

