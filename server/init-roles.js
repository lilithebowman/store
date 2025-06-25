const Role = require("./models/Role");

async function initializeDefaultRoles() {
	try {
		console.log("Initializing default roles...");

		// Check if roles already exist
		const existingRoles = await Role.count();
		if (existingRoles > 0) {
			console.log("Roles already exist, skipping initialization");
			return;
		}

		// Create default roles
		const roles = [
			{
				name: "Admin",
				description: "Full system administrator with all permissions",
				permissions: {
					add_user: true,
					delete_user: true,
					edit_user: true,
					add_product: true,
					edit_product: true,
					delete_product: true,
					add_page: true,
					edit_page: true,
					delete_page: true,
				},
			},
			{
				name: "User Manager",
				description: "Can manage users but not products or pages",
				permissions: {
					add_user: true,
					delete_user: true,
					edit_user: true,
					add_product: false,
					edit_product: false,
					delete_product: false,
					add_page: false,
					edit_page: false,
					delete_page: false,
				},
			},
			{
				name: "Product Manager",
				description: "Can manage products but not users or pages",
				permissions: {
					add_user: false,
					delete_user: false,
					edit_user: false,
					add_product: true,
					edit_product: true,
					delete_product: true,
					add_page: false,
					edit_page: false,
					delete_page: false,
				},
			},
			{
				name: "Content Manager",
				description:
					"Can manage pages/content but not users or products",
				permissions: {
					add_user: false,
					delete_user: false,
					edit_user: false,
					add_product: false,
					edit_product: false,
					delete_product: false,
					add_page: true,
					edit_page: true,
					delete_page: true,
				},
			},
			{
				name: "Editor",
				description: "Can edit existing content but not add or delete",
				permissions: {
					add_user: false,
					delete_user: false,
					edit_user: true,
					add_product: false,
					edit_product: true,
					delete_product: false,
					add_page: false,
					edit_page: true,
					delete_page: false,
				},
			},
		];

		// Create roles
		for (const roleData of roles) {
			const role = await Role.create(roleData);
			console.log(`✅ Created role: ${role.name} (ID: ${role.id})`);
		}

		console.log("✅ Default roles initialized successfully!");

		// Show available roles
		const allRoles = await Role.findAll();
		console.log("\nAvailable roles:");
		allRoles.forEach((role) => {
			console.log(`- ${role.name} (ID: ${role.id}): ${role.description}`);
		});
	} catch (error) {
		console.error("❌ Error initializing roles:", error.message);
	}
}

// Run if called directly
if (require.main === module) {
	initializeDefaultRoles()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error("Fatal error:", error);
			process.exit(1);
		});
}

module.exports = initializeDefaultRoles;
