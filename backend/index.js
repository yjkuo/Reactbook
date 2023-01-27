const auth = require('./src/auth');
const profile = require('./src/profile');
const article = require('./src/articles');
const express = require('express');
const cors = require('cors');
const url = path => `http://localhost:3000${path}`;
const corsOptions = {origin: ['http://localhost:3000', 'http://localhost:3001/auth/google', 'https://yk66.surge.sh'] , credentials: true}
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');




const hello = (req, res) => res.send({ hello: 'world' });

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.get('/', hello);
// upCloud.setup(app)
auth.auth(app);
profile(app);
article(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
});
