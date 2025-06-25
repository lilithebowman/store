// Quick script to create product showcase pages
const { Page, User } = require('./models');

const createProductShowcase = async (title, products = null) => {
	try {
		// Find an admin user
		const adminUser = await User.findOne({ where: { isAdmin: true } });
		if (!adminUser) {
			console.log('No admin user found. Please create an admin user first.');
			return;
		}

		// Use provided products or default sample products
		const productsToUse = products || [
			{
				id: 1,
				name: 'Wireless Bluetooth Headphones',
				description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
				price: '199.99',
				image: 'https://via.placeholder.com/400x300/1976d2/ffffff?text=Headphones',
				stock: 25
			},
			{
				id: 2,
				name: 'Smart Fitness Watch',
				description: 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.',
				price: '299.99',
				image: 'https://via.placeholder.com/400x300/4caf50/ffffff?text=Smart+Watch',
				stock: 15
			},
			{
				id: 3,
				name: 'Ergonomic Laptop Stand',
				description: 'Adjustable aluminum laptop stand designed for improved posture and airflow.',
				price: '49.99',
				image: 'https://via.placeholder.com/400x300/ff9800/ffffff?text=Laptop+Stand',
				stock: 50
			}
		];

		// Create components array
		const components = [
			{
				id: 'header-text',
				componentId: 'text-block',
				props: {
					content: `<h1>${title}</h1><p>Discover our amazing collection of products!</p>`
				}
			}
		];

		// Add product cards
		productsToUse.forEach((product, index) => {
			components.push({
				id: `product-card-${product.id}`,
				componentId: 'product-card',
				props: { product }
			});

			// Add spacer every 3 products for better layout
			if ((index + 1) % 3 === 0 && index < productsToUse.length - 1) {
				components.push({
					id: `spacer-${index}`,
					componentId: 'spacer',
					props: { height: 40 }
				});
			}
		});

		// Generate slug from title
		const slug = title.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();

		// Create the page
		const showcasePage = await Page.create({
			title,
			slug,
			content: `This page showcases our products using the ProductCard component integration.`,
			metaDescription: `${title} - Browse our curated collection of products`,
			status: 'published',
			authorId: adminUser.id,
			components
		});

		console.log('✅ Product showcase page created successfully!');
		console.log(`📄 Page: ${showcasePage.title}`);
		console.log(`🔗 URL: /pages/${showcasePage.slug}`);
		console.log(`🌐 Visit: http://localhost:3000/pages/${showcasePage.slug}`);
		console.log(`📊 Products: ${productsToUse.length}`);

		return showcasePage;

	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			console.error('❌ Error: A page with this slug already exists. Try a different title.');
		} else {
			console.error('❌ Error creating showcase page:', error.message);
		}
	}
};

// Command line usage
const args = process.argv.slice(2);
if (args.length === 0) {
	console.log('Usage: node create-product-showcase.js "Page Title"');
	console.log('Example: node create-product-showcase.js "Summer Collection 2025"');
	process.exit(1);
}

const title = args[0];
createProductShowcase(title)
	.then(() => process.exit(0))
	.catch(error => {
		console.error('Script failed:', error);
		process.exit(1);
	});
