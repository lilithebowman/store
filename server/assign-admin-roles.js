const User = require("./models/User");
const Role = require("./models/Role");

async function assignRolesToAdmin() {
	try {
		console.log("Finding admin user...");
		const adminUser = await User.findOne({
			where: { email: "admin@example.com" },
		});

		if (!adminUser) {
			console.log("❌ Admin user not found");
			return;
		}

		console.log("Finding Admin role...");
		const adminRole = await Role.findOne({ where: { name: "Admin" } });

		if (!adminRole) {
			console.log("❌ Admin role not found");
			return;
		}

		// Assign the admin role to the admin user
		await adminUser.update({
			roles: adminRole.id.toString(),
		});

		console.log("✅ Admin role assigned to admin user!");
		console.log(`User: ${adminUser.username} (${adminUser.email})`);
		console.log(`Role: ${adminRole.name} (ID: ${adminRole.id})`);
		console.log(`User roles: ${adminUser.roles}`);

		// Show user permissions
		const permissions = await adminUser.getPermissions();
		console.log("User permissions:", permissions);
	} catch (error) {
		console.error("❌ Error assigning roles:", error.message);
	}
}

// Run if called directly
if (require.main === module) {
	assignRolesToAdmin()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error("Fatal error:", error);
			process.exit(1);
		});
}

module.exports = assignRolesToAdmin;
