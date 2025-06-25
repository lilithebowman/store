const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/permissions");

// Get all roles (admin only)
router.get("/", authenticate, requireAdmin, roleController.getAllRoles);

// Get role by ID (admin only)
router.get("/:id", authenticate, requireAdmin, roleController.getRoleById);

// Create new role (admin only)
router.post("/", authenticate, requireAdmin, roleController.createRole);

// Update role (admin only)
router.put("/:id", authenticate, requireAdmin, roleController.updateRole);

// Delete role (admin only)
router.delete("/:id", authenticate, requireAdmin, roleController.deleteRole);

module.exports = router;
