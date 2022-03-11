// @ts-nocheck
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');



//serialize User function used to give user token when user already sign in successfully
passport.serializeUser((user, done) => {
    //user.id is the id assigned by mongo DB for our record
    done(null, user.id);
});

//the deserialize User function takes user id and return to us the actual user
passport.deserializeUser((id, done) => {
    //find our user by it is passed id
    //any time you access mongo DB it is Async action and to deal with that you have to assume it return promise
    // and the promise will resolve after a user by given id is found
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

//inform passport to use GoogleStrategy
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            //check if user is already exists ok login if not create new one

            User.findOne({ googleId: profile.id })
                .then((existingUser) => {
                    if (existingUser) {
                        //we already have a record with the given profile ID
                        //call done method to finish google auth
                        done(null, existingUser);
                    } else {
                        //we don't have a user record with this ID, make new record
                        new User({ googleId: profile.id })
                            .save()
                            .then(user => done(null, user));
                    }
                });

        }
    )
);
