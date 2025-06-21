const { sequelize } = require('./config/database');

async function testPageModel() {
	try {
		console.log('Testing database connection...');
		await sequelize.authenticate();
		console.log('✅ Database connection successful');

		// Force sync all models to create tables
		console.log('Syncing all models...');
		await sequelize.sync({ force: false, alter: true });
		console.log('✅ Database models synchronized');

		// Check if we can import the Page model
		const Page = require('./models/Page');
		console.log('✅ Page model imported successfully');

		// Test creating a page
		console.log('Creating test page...');
		const uniqueSlug = `test-page-${Date.now()}`;
		const testPage = await Page.create({
			title: 'Test Page',
			slug: uniqueSlug,
			content: 'This is a test page content.',
			status: 'published',
			metaDescription: 'A test page for verification'
		});
		console.log('✅ Test page created:', testPage.toJSON());

		// Fetch all pages
		const pages = await Page.findAll();
		console.log('✅ All pages:', pages.length);

		console.log('✅ Page model is working correctly!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

testPageModel();
