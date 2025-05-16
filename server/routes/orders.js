const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

// Create a new order
router.post('/', authMiddleware, orderController.createOrder);

// Get all orders
router.get('/', authMiddleware, orderController.getAllOrders);

// Get a specific order by ID
router.get('/:id', authMiddleware, orderController.getOrderById);

// Update an order by ID
router.put('/:id', authMiddleware, orderController.updateOrder);

// Delete an order by ID
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;