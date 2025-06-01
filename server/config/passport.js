const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id); // Use findByPk instead of findById
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Local strategy for username and password authentication
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Use email as username field
    async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ 
            where: { 
                oauthProvider: 'google',
                oauthId: profile.id 
            }
        });
        
        if (!user) {
            user = await User.create({
                oauthProvider: 'google',
                oauthId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                password: 'oauth_user' // Placeholder for OAuth users
            });
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
}));

module.exports = passport;