#!/usr/bin/env node

// Simple test script to verify home page functionality
const fetch = require("node-fetch");

async function testHomePage() {
	console.log("🧪 Testing Home Page Implementation\n");

	try {
		// Test 1: Check if home page exists in database
		console.log("1️⃣ Testing home page API endpoint...");
		const response = await fetch(
			"http://localhost:2048/api/pages/slug/home",
		);

		if (response.ok) {
			const page = await response.json();
			console.log(`✅ Home page found: "${page.title}"`);
			console.log(`📄 Status: ${page.status}`);
			console.log(`🧩 Components: ${page.components.length}`);
			console.log(`📝 Content: ${page.content.substring(0, 50)}...`);
		} else {
			console.log(`❌ Home page API failed: ${response.status}`);
		}

		// Test 2: Check 404 behavior
		console.log("\n2️⃣ Testing 404 behavior...");
		const notFoundResponse = await fetch(
			"http://localhost:2048/api/pages/slug/nonexistent",
		);
		if (notFoundResponse.status === 404) {
			console.log("✅ 404 handling works correctly");
		} else {
			console.log(`❌ Expected 404, got ${notFoundResponse.status}`);
		}

		// Test 3: Check frontend is accessible
		console.log("\n3️⃣ Testing frontend accessibility...");
		const frontendResponse = await fetch("http://localhost:3000");
		if (frontendResponse.ok) {
			console.log("✅ Frontend is accessible");
		} else {
			console.log(
				`❌ Frontend not accessible: ${frontendResponse.status}`,
			);
		}

		console.log("\n🎉 All tests completed!");
		console.log("\n📋 Next Steps:");
		console.log("   • Visit http://localhost:3000 to see the home page");
		console.log(
			"   • Visit http://localhost:3000/admin/pages to manage pages",
		);
		console.log(
			"   • The home page should show full-width page builder content",
		);
	} catch (error) {
		console.error("❌ Test failed:", error.message);
	}
}

testHomePage();
