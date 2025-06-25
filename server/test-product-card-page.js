// Test script to create a page with ProductCard components
const { Page, User } = require("./models");

async function createTestPage() {
	try {
		// Find an admin user
		const adminUser = await User.findOne({ where: { isAdmin: true } });
		if (!adminUser) {
			console.log("No admin user found");
			return;
		}

		// Create a test page with ProductCard components
		const testPage = await Page.create({
			title: "Test Product Showcase",
			slug: "test-product-showcase",
			content: "This page demonstrates ProductCard components in action.",
			metaDescription: "A test page showcasing product cards",
			status: "published",
			authorId: adminUser.id,
			components: [
				{
					id: "product-card-1",
					componentId: "product-card",
					props: {
						product: {
							id: 1,
							name: "Premium Headphones",
							description:
								"High-quality wireless headphones with noise cancellation",
							price: "199.99",
							image: "https://via.placeholder.com/400x300/4caf50/ffffff?text=Headphones",
							stock: 25,
						},
					},
				},
				{
					id: "text-block-1",
					componentId: "text-block",
					props: {
						content:
							"<h2>Our Featured Products</h2><p>Check out these amazing products available in our store!</p>",
					},
				},
				{
					id: "product-card-2",
					componentId: "product-card",
					props: {
						product: {
							id: 2,
							name: "Smart Watch",
							description:
								"Feature-rich smartwatch with health tracking",
							price: "299.99",
							image: "https://via.placeholder.com/400x300/2196f3/ffffff?text=Smart+Watch",
							stock: 15,
						},
					},
				},
				{
					id: "product-card-3",
					componentId: "product-card",
					props: {
						product: {
							id: 3,
							name: "Laptop Stand",
							description:
								"Ergonomic aluminum laptop stand for better posture",
							price: "49.99",
							image: "https://via.placeholder.com/400x300/ff9800/ffffff?text=Laptop+Stand",
							stock: 50,
						},
					},
				},
			],
		});

		console.log("Test page created successfully!");
		console.log(`Page ID: ${testPage.id}`);
		console.log(`Page URL: /pages/${testPage.slug}`);
		console.log(`Visit: http://localhost:3000/pages/${testPage.slug}`);
	} catch (error) {
		console.error("Error creating test page:", error);
	} finally {
		process.exit();
	}
}

createTestPage();
