const { sequelize } = require("./config/database");
const User = require("./models/User");

async function makeUserAdmin(email) {
	try {
		await sequelize.authenticate();
		console.log("🔍 Looking for user with email:", email);

		const user = await User.findOne({ where: { email } });

		if (!user) {
			console.log("❌ User not found with email:", email);
			return;
		}

		if (user.isAdmin) {
			console.log(
				"✅ User is already an admin:",
				user.username,
				`(${user.email})`,
			);
			return;
		}

		await user.update({ isAdmin: true });
		console.log(
			"✅ Successfully made user admin:",
			user.username,
			`(${user.email})`,
		);

		await sequelize.close();
		process.exit(0);
	} catch (error) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

// Get email from command line arguments
const email = process.argv[2];
if (!email) {
	console.log("Usage: node make-user-admin.js <email>");
	console.log("Example: node make-user-admin.js lilithe.bowman@gmail.com");
	process.exit(1);
}

makeUserAdmin(email);
