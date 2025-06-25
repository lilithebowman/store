// Template data generator for home page creation
// Outputs JSON that can be used to create a home page via the Page Management UI

async function createHomePage() {
	try {
		// First, let's try to get a token by logging in as admin
		console.log("🔑 Attempting to create home page...");

		const defaultComponents = [
			{
				id: "hero-1",
				componentId: "text-block",
				props: {
					content:
						'<h1 style="text-align: center; color: #1976d2; margin-bottom: 16px; font-size: 3rem;">Welcome to Our Store</h1><p style="text-align: center; font-size: 1.2em; color: #666; max-width: 600px; margin: 0 auto;">Discover amazing products and unbeatable deals in our premium collection</p>',
				},
			},
			{
				id: "spacer-1",
				componentId: "spacer",
				props: {
					height: 30,
				},
			},
			{
				id: "cta-1",
				componentId: "button",
				props: {
					label: "Shop Now",
					variant: "contained",
					color: "primary",
					size: "large",
					actionType: "none",
					showNotifications: true,
				},
			},
			{
				id: "spacer-2",
				componentId: "spacer",
				props: {
					height: 50,
				},
			},
			{
				id: "featured-products",
				componentId: "text-block",
				props: {
					content:
						'<h2 style="text-align: center; margin-bottom: 24px; color: #333;">Featured Products</h2><p style="text-align: center; color: #666;">Check out our most popular items selected just for you</p>',
				},
			},
		];

		const pageData = {
			title: "Home",
			slug: "home",
			content:
				"Welcome to our amazing e-commerce store! Browse our products and find great deals.",
			components: defaultComponents,
			metaDescription:
				"Welcome to our e-commerce store - your one-stop shop for amazing products and great deals.",
			status: "published",
		};

		console.log("📄 Home page data prepared");
		console.log("🎨 Components:", defaultComponents.length);
		console.log("✅ Ready to create via Page Management UI");
		console.log("");
		console.log("📋 Copy this JSON to create the page:");
		console.log(JSON.stringify(pageData, null, 2));
	} catch (error) {
		console.error("❌ Error:", error.message);
	}
}

createHomePage();
