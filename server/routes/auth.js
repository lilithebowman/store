const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', passport.authenticate('local', { session: false }), authController.login);

// OAuth routes
router.get('/oauth/:provider', passport.authenticate('oauth2', { session: false }));

router.get('/oauth/:provider/callback', passport.authenticate('oauth2', { session: false }), authController.oauthCallback);

// Logout
router.post('/logout', authController.logout);

module.exports = router;