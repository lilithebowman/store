// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time
// Note: This is MongoDB shell script syntax, not Node.js JavaScript

/* eslint-disable */
/* global db, print */

// Switch to the ecommerce_db database
db = db.getSiblingDB('ecommerce_db');

// Create a user for the application
db.createUser({
	user: 'mongouser',
	pwd: 'mongopassword',
	roles: [
		{
			role: 'readWrite',
			db: 'ecommerce_db'
		}
	]
});

// Create initial collections (optional)
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('pages');
db.createCollection('roles');

print('MongoDB initialization completed successfully!');
