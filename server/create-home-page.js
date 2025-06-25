const { sequelize } = require("./config/database");
const Page = require("./models/Page");

async function createHomePage() {
	try {
		console.log("🏠 Creating home page...");

		// Connect to database
		await sequelize.authenticate();
		console.log("✅ Database connected");

		// Check if home page already exists
		const existingHomePage = await Page.findOne({
			where: { slug: "home" },
		});

		if (existingHomePage) {
			console.log("📄 Home page already exists!");
			console.log("🎯 Title:", existingHomePage.title);
			console.log("🔗 Slug:", existingHomePage.slug);
			console.log("📊 Status:", existingHomePage.status);
			console.log(
				"🎨 Components:",
				existingHomePage.components?.length || 0,
			);
			return;
		}

		// Create home page with sample components for full-width layout
		const defaultComponents = [
			{
				id: "hero-section",
				componentId: "text-block",
				props: {
					content:
						'<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: -16px -16px 32px -16px;"><h1 style="font-size: 3.5rem; margin-bottom: 16px; font-weight: 300;">Welcome to Our Store</h1><p style="font-size: 1.3rem; opacity: 0.9; max-width: 600px; margin: 0 auto;">Discover amazing products and unbeatable deals in our premium collection</p></div>',
				},
			},
			{
				id: "cta-section",
				componentId: "text-block",
				props: {
					content:
						'<div style="text-align: center; padding: 40px 20px;"><div style="max-width: 400px; margin: 0 auto;"></div></div>',
				},
			},
			{
				id: "shop-button",
				componentId: "button",
				props: {
					label: "Start Shopping",
					variant: "contained",
					color: "primary",
					size: "large",
					actionType: "none",
					showNotifications: true,
				},
			},
			{
				id: "features-section",
				componentId: "text-block",
				props: {
					content:
						'<div style="background-color: #f5f5f5; padding: 60px 20px; margin: 40px -16px; text-align: center;"><h2 style="color: #333; margin-bottom: 40px; font-size: 2.5rem;">Why Choose Us?</h2><div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;"><div style="padding: 20px;"><h3 style="color: #1976d2; margin-bottom: 16px;">🚚 Fast Shipping</h3><p style="color: #666;">Free shipping on orders over $50</p></div><div style="padding: 20px;"><h3 style="color: #1976d2; margin-bottom: 16px;">🛡️ Secure Payments</h3><p style="color: #666;">Your payment information is safe with us</p></div><div style="padding: 20px;"><h3 style="color: #1976d2; margin-bottom: 16px;">⭐ Top Quality</h3><p style="color: #666;">Only the best products make it to our store</p></div></div></div>',
				},
			},
		];

		const homePage = await Page.create({
			title: "Home",
			slug: "home",
			content: "Welcome to our amazing e-commerce store!",
			components: defaultComponents,
			metaDescription:
				"Welcome to our e-commerce store - your one-stop shop for amazing products and great deals.",
			status: "published",
		});

		console.log("✅ Home page created successfully!");
		console.log("📄 ID:", homePage.id);
		console.log("🎯 Title:", homePage.title);
		console.log("🔗 Slug:", homePage.slug);
		console.log("📊 Status:", homePage.status);
		console.log("🎨 Components:", homePage.components?.length || 0);
		console.log("🌐 URL: http://localhost:3000/");
		console.log("🔧 Edit: http://localhost:3000/admin/pages");
	} catch (error) {
		console.error("❌ Error creating home page:", error.message);
		if (error.name === "SequelizeUniqueConstraintError") {
			console.log('💡 A page with slug "home" already exists');
		}
	}
}

createHomePage()
	.then(() => {
		console.log("🎉 Script completed!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("💥 Script failed:", error);
		process.exit(1);
	});
