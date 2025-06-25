const { sequelize } = require("./config/database");
const User = require("./models/User");

async function verify() {
	try {
		await sequelize.authenticate();
		const count = await User.count();
		console.log(`Users remaining: ${count}`);
		await sequelize.close();
		process.exit(0);
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
}

verify();
