const auth = require('./auth');
const schema = require('./schema');
const mongoose = require('mongoose');
const uploadImage = require('./uploadCloudinary');
const User = mongoose.model('user', schema.userSchema);
const Profile = mongoose.model('profile', schema.profileSchema);
const connectionString = process.env.CONNECTION_STRING;

async function getProfile(username) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    return await connector.then(async () => {
        return await Profile.findOne({ username })
    });
}

async function update(username, query) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    return await connector.then(async () => {
        return await Profile.findOneAndUpdate({ username }, query, { new: true } );
    });
}

async function getUser(username) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    return await connector.then(async () => {
        return await User.findOne({ username })
    });
}

const getHeadline = (req, res) => {
    let username = req.params.user ? req.params.user : req.username;
    (async () => {
        let user = await getProfile(username);
        res.send({ username: user.username, headline: user.headline })
    })();
      
}

const updateHeadline = (req, res) => {
    let newHeadline = req.body.headline
    let username = req.username;
    if (!newHeadline) {
        return res.sendStatus(400);
    }
    (async () => {
        await update(username, { headline: newHeadline });
        res.send({ username: username, headline: newHeadline}) 
    })();
     
}

const getFollowing = (req, res) => {
    let username = req.params.user ? req.params.user : req.username;
    (async () => {
        let user = await getProfile(username);
        res.send({ username: user.username, following: user.following});
    })();
}

const updateFollowing = (req, res) => {
    let following = req.params.user
    let username = req.username;
    
    (async () => {
        const userObj = await getUser(following);
        if (!userObj) {
            return res.sendStatus(403);
        } else {
            let user = await update(username, { $push: {following: following }});
            res.send({ username: user.username, following: user.following}) 
        }
    })();
}

const deleteFollowing = (req, res) => {
    let userToUnfollow = req.params.user
    let username = req.username;
    (async () => {
        let user = await update(username, { $pull: {following: userToUnfollow }});
        res.send({ username: user.username, following: user.following}) 
    })(); 
}

const getEmail = (req, res) => {
    let username = req.params.user ? req.params.user : req.username;
    (async () => {
        let user = await getProfile(username);
        res.send({ username: user.username, email: user.email});
    })();  
}

const updateEmail = (req, res) => {
    let email = req.body.email;
    let username = req.username;
    if (!email) {
        return res.sendStatus(400);
    }
    (async () => {
        let user = await update(username, {email: email });
        res.send({ username: user.username, email: user.email}); 
    })(); 
}
const updatePhone = (req, res) => {
    let phone = req.body.phone;
    let username = req.username;
    if (!phone) {
        return res.sendStatus(400);
    }
    (async () => {
        let user = await update(username, {phone: phone });
        res.send({ username: user.username, phone: user.phone}); 
    })(); 
}

const getZipcode = (req, res) => {
    let username = req.params.user ? req.params.user : req.username;
    (async () => {
        let user = await getProfile(username);
        res.send({ username: user.username, zipcode: user.zipcode});
    })();  
}

const updateZipcode = (req, res) => {
    let zipcode = req.body.zipcode;
    let username = req.username;
    if (!zipcode) {
        return res.sendStatus(400);
    }
    (async () => {
        let user = await update(username, {zipcode: zipcode });
        res.send({ username: user.username, zipcode: user.zipcode}); 
    })();  
}

const getDob = (req, res) => {
    let username = req.params.user ? req.params.user : req.username;
    (async () => {
        let user = await getProfile(username);
        res.send({ username: user, dob: user.dob });
    })();
      
}

const getAvatar = (req, res) => {
    let username = req.params.user ? req.params.user : req.username;
    (async () => {
        let user = await getProfile(username);
        res.send({ username: user, avatar: user.picture });
    })();
}

const updateAvatar = (req, res) => {
    let username = req.username;
    (async () => {
        let user = await update(username, {picture: req.fileurl });
        res.send({ username: req.username, avatar: req.fileurl });  
    })();  
}

const getProfileInfo = (req, res) => {
    let username = req.username;
    (async () => {
        let user = await getUser(username);
        let pf = await getProfile(username);
        let auth = user.hash?true:false;
        res.send({ username: pf.username,
                    headline: pf.headline,
                    email: pf.email,
                    zipcode: pf.zipcode,
                    dob: pf.dob,
                    avatar: pf.picture,
                    phone: pf.phone,
                    auth: auth
        });
    })();   
}

module.exports = (app) => {
app.get('/headline/:user?', auth.isLoggedIn, getHeadline);
app.put('/headline', auth.isLoggedIn, updateHeadline);

app.get('/following/:user?', auth.isLoggedIn, getFollowing);
app.put('/following/:user', auth.isLoggedIn, updateFollowing);
app.delete('/following/:user', auth.isLoggedIn, deleteFollowing);

app.get('/email/:user?', auth.isLoggedIn, getEmail);
app.put('/email', auth.isLoggedIn, updateEmail);
app.put('/phone', auth.isLoggedIn, updatePhone);
app.get('/zipcode/:user?', auth.isLoggedIn, getZipcode);
app.put('/zipcode', auth.isLoggedIn, updateZipcode);
app.get('/dob/:user?', auth.isLoggedIn, getDob);
app.get('/avatar/:user?', auth.isLoggedIn, getAvatar);
app.put('/avatar', auth.isLoggedIn, uploadImage('avatar'), updateAvatar);
app.get('/profile', auth.isLoggedIn, getProfileInfo);

}