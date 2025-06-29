const { databaseManager } = require('./config/database');
const { User } = require('./models/ModelAdapter');
const db = require('./models');

async function testAuth() {
	try {
		console.log('🧪 Testing authentication system...');

		// Initialize database
		await databaseManager.initialize();
		console.log('✅ Database connected');

		// Setup MongoDB models
		await db.syncDatabase();
		console.log('✅ Models initialized');

		// Clean up any existing test user first
		await User.destroy({
			where: { email: 'test@example.com' }
		});
		console.log('✅ Cleaned up any existing test user');

		// Test creating a user
		const testUser = await User.create({
			username: 'testuser',
			email: 'test@example.com',
			password: 'testpassword123'
		});

		console.log('✅ User created:', testUser.username);
		console.log('Password stored as hash:', testUser.password.substring(0, 20) + '...');

		// Test finding the user
		const foundUser = await User.findOne({
			where: { email: 'test@example.com' }
		});

		if (foundUser) {
			console.log('✅ User found:', foundUser.username);

			// Test password comparison
			if (foundUser.comparePassword) {
				const isValidPassword = await foundUser.comparePassword('testpassword123');
				const isInvalidPassword = await foundUser.comparePassword('wrongpassword');

				console.log('✅ Valid password check:', isValidPassword);
				console.log('✅ Invalid password check:', isInvalidPassword);

				if (isValidPassword && !isInvalidPassword) {
					console.log('🎉 Authentication system working correctly!');
				} else {
					console.log('❌ Password comparison failed');
				}
			} else {
				console.log('❌ comparePassword method not available');
			}
		} else {
			console.log('❌ User not found');
		}

		// Clean up test user
		await User.destroy({
			where: { email: 'test@example.com' }
		});
		console.log('✅ Test user cleaned up');

		process.exit(0);

	} catch (error) {
		console.error('❌ Test failed:', error.message);
		console.error(error.stack);
		process.exit(1);
	}
}

testAuth();
