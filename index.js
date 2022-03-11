// @ts-nocheck
const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const cookieSession = require('cookie-session');
const passport = require('passport');

require('./models/User');
require('./services/passport');


//declare app
const app = express();

//tell express to make use of cookie
app.use(
    cookieSession({
        maxAge: 30 * 25 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

//tell passport to make use of cookies for Authentication
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;

//adding database connection
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));
