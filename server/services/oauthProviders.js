const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Configure Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
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
                password: 'oauth_placeholder'
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Configure Facebook OAuth (if needed)
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ 
            where: { 
                oauthProvider: 'facebook',
                oauthId: profile.id 
            }
        });
        
        if (!user) {
            user = await User.create({
                oauthProvider: 'facebook',
                oauthId: profile.id,
                username: profile.displayName,
                email: profile.emails?.[0]?.value || `facebook_${profile.id}@example.com`
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;