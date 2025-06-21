const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { uploadProfileImage } = require('../middlewares/upload');

// Route to get all users
router.get('/', authenticate, userController.getAllUsers);

// Route to get a user by ID
router.get('/:id', authenticate, userController.getUserById);

// Route to create a new user
router.post('/', userController.createUser);

// Route to update a user by ID
router.put('/:id', authenticate, userController.updateUser);

// Route to update profile image
router.put('/profile/image', authenticate, uploadProfileImage, userController.updateProfileImage);

// Route to delete a user by ID
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;