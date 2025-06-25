const { sequelize } = require("./config/database");
const User = require("./models/User");
const fs = require("fs");
const path = require("path");

/**
 * Utility script to delete all users from the database
 * WARNING: This will permanently delete ALL user records!
 */

async function deleteAllUsers() {
	try {
		console.log("🔄 Starting user deletion process...");

		// Connect to the database
		await sequelize.authenticate();
		console.log("✅ Database connection established.");

		// Get all users to clean up their profile images first
		const users = await User.findAll({
			attributes: ["id", "username", "email", "profileImage"],
		});

		console.log(`📊 Found ${users.length} users to delete.`);

		// Clean up profile images
		let imagesCleaned = 0;
		for (const user of users) {
			if (user.profileImage) {
				const imagePath = path.join(
					__dirname,
					"uploads",
					"profiles",
					user.profileImage,
				);
				try {
					if (fs.existsSync(imagePath)) {
						fs.unlinkSync(imagePath);
						imagesCleaned++;
						console.log(
							`🗑️  Deleted profile image for user: ${user.username}`,
						);
					}
				} catch (error) {
					console.warn(
						`⚠️  Could not delete image ${user.profileImage}:`,
						error.message,
					);
				}
			}
		}

		console.log(`🖼️  Cleaned up ${imagesCleaned} profile images.`); // First, handle foreign key constraints by deleting related records
		console.log("🔗 Checking for related records...");

		// Delete related orders first (if any)
		try {
			const Order = require("./models/Order");
			const orderCount = await Order.destroy({ where: {} });
			if (orderCount > 0) {
				console.log(`🗑️  Deleted ${orderCount} related orders.`);
			}
		} catch (error) {
			console.log("📝 No Order model found or no orders to delete.");
		}

		// Delete all users using regular DELETE instead of TRUNCATE
		const deletedCount = await User.destroy({
			where: {},
			force: true, // Force delete even if there are soft deletes
		});

		console.log(
			`✅ Successfully deleted ${deletedCount} users from the database.`,
		);
		console.log("🎉 All users have been removed!");

		// Reset auto-increment counter
		try {
			await sequelize.query("ALTER TABLE Users AUTO_INCREMENT = 1;");
			console.log("🔄 Reset user ID auto-increment counter.");
		} catch (error) {
			console.log(
				"⚠️  Could not reset auto-increment counter (this is usually fine).",
			);
		}
	} catch (error) {
		console.error("❌ Error deleting users:", error);
		process.exit(1);
	} finally {
		// Close database connection
		await sequelize.close();
		console.log("🔒 Database connection closed.");
		process.exit(0);
	}
}

// Confirmation prompt
console.log("⚠️  WARNING: This will delete ALL users from the database!");
console.log("📁 Profile images will also be deleted from the file system.");
console.log("💾 This action cannot be undone!");
console.log("");

// Check if running with --confirm flag
const args = process.argv.slice(2);
if (args.includes("--confirm")) {
	deleteAllUsers();
} else {
	console.log("❌ To proceed, run this script with the --confirm flag:");
	console.log("   node delete-all-users.js --confirm");
	process.exit(0);
}
