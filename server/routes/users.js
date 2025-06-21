const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { requirePermission, requireAdmin } = require('../middlewares/permissions');
const { uploadProfileImage } = require('../middlewares/upload');

// Route to get all users (admin only)
router.get('/', authenticate, requireAdmin, userController.getAllUsers);

// Route to get a user by ID
router.get('/:id', authenticate, userController.getUserById);

// Route to get user permissions
router.get('/:id/permissions', authenticate, userController.getUserPermissions);

// Route to create a new user (requires add_user permission)
router.post('/', authenticate, requirePermission('add_user'), userController.createUser);

// Route to update a user by ID (requires edit_user permission)
router.put('/:id', authenticate, requirePermission('edit_user'), userController.updateUser);

// Route to update profile image (own profile or edit_user permission)
router.put('/profile/image', authenticate, uploadProfileImage, userController.updateProfileImage);

// Route to delete a user by ID (requires delete_user permission)
router.delete('/:id', authenticate, requirePermission('delete_user'), userController.deleteUser);

module.exports = router;