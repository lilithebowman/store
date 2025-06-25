// Test script to create a sample page for demonstration
async function createTestPage() {
	try {
		// You'll need to replace this with a valid JWT token from an admin user
		// const authToken = 'your-admin-jwt-token-here';

		// const baseURL = 'http://localhost:2048/api';

		const samplePage = {
			title: 'Welcome to Our Store',
			slug: 'welcome',
			content: `# Welcome to Our E-Commerce Store

## About Us
We are a modern e-commerce platform offering high-quality products at competitive prices.

### Our Mission
To provide exceptional customer service and deliver the best shopping experience online.

### What We Offer
- Wide selection of products
- Competitive pricing
- Fast shipping
- Excellent customer support

## Contact Information
For any questions or concerns, please don't hesitate to reach out to us!

**Email:** support@example.com  
**Phone:** +1 (555) 123-4567`,
			metaDescription: 'Welcome to our e-commerce store - discover quality products at great prices',
			status: 'published'
		};

		console.log('Creating test page...');
		console.log('Note: You need to replace the authToken with a valid admin JWT token');
		console.log('\nSample page data:');
		console.log(JSON.stringify(samplePage, null, 2));

		// Uncomment the lines below when you have a valid auth token
		/*
		const response = await axios.post(`${baseURL}/pages`, samplePage, {
			headers: {
				'Authorization': `Bearer ${authToken}`,
				'Content-Type': 'application/json'
			}
		});
	    
		console.log('Test page created successfully!');
		console.log('Page ID:', response.data.id);
		console.log('You can now view it at: http://localhost:3000/pages/welcome');
		*/

	} catch (error) {
		console.error('Error creating test page:', error.response?.data || error.message);
	}
}

createTestPage();
