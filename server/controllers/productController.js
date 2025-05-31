const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
	try {
		const products = await Product.findAll();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving products', error });
	}
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving product', error });
	}
};

// Create a new product
exports.createProduct = async (req, res) => {
	try {
		const savedProduct = await Product.create(req.body);
		res.status(201).json(savedProduct);
	} catch (error) {
		res.status(400).json({ message: 'Error creating product', error });
	}
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const [updated] = await Product.update(req.body, {
			where: { id }
		});
		if (updated === 0) {
			return res.status(404).json({ message: 'Product not found' });
		}
		const updatedProduct = await Product.findByPk(id);
		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(400).json({ message: 'Error updating product', error });
	}
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const deleted = await Product.destroy({
			where: { id }
		});
		if (deleted === 0) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Error deleting product', error });
	}
};