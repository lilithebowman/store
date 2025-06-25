const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permissions");

// Test route to debug
router.get("/test", (req, res) => {
	res.json({ message: "Pages route is working" });
});

// Public routes (no authentication required)
router.get("/published", pageController.getPublishedPages);
router.get("/slug/:slug", pageController.getPageBySlug);

// Middleware to check if user has any page management permission
const requirePageAccess = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Authentication required" });
		}

		// Admin users have all permissions
		if (req.user.isAdmin) {
			return next();
		}

		// Check if user has any page permission
		const hasAddPage = await req.user.hasPermission("add_page");
		const hasEditPage = await req.user.hasPermission("edit_page");
		const hasDeletePage = await req.user.hasPermission("delete_page");

		if (hasAddPage || hasEditPage || hasDeletePage) {
			return next();
		}

		return res.status(403).json({
			message: "Access denied. Page management permissions required.",
		});
	} catch (error) {
		console.error("Page access check error:", error);
		return res.status(500).json({ message: "Permission check failed" });
	}
};

// Protected routes (authentication required)
// Get all pages (requires any page management permissions)
router.get("/", authenticate, requirePageAccess, pageController.getAllPages);

// Get page by ID (requires any page management permissions)
router.get("/:id", authenticate, requirePageAccess, pageController.getPageById);

// Create new page (requires add_page permission)
router.post(
	"/",
	authenticate,
	requirePermission("add_page"),
	pageController.createPage,
);

// Update page (requires edit_page permission)
router.put(
	"/:id",
	authenticate,
	requirePermission("edit_page"),
	pageController.updatePage,
);

// Delete page (requires delete_page permission)
router.delete(
	"/:id",
	authenticate,
	requirePermission("delete_page"),
	pageController.deletePage,
);

module.exports = router;
