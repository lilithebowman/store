const Order = require('../models/Order');
const { OrderProduct } = require('../models'); // Import the OrderProduct model

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        // Use create instead of new + save
        const order = await Order.create(req.body);

        // If products are included in the request, create order items
        if (req.body.products && Array.isArray(req.body.products)) {
            const orderItems = req.body.products.map(product => ({
                orderId: order.id,
                productId: product.id,
                quantity: product.quantity,
                price: product.price
            }));

            await OrderProduct.bulkCreate(orderItems);
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        // Use findAll instead of find
        const orders = await Order.findAll({
            include: ['products'] // Include associated products
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        // Use findByPk instead of findById
        const order = await Order.findByPk(req.params.id, {
            include: ['products'] // Include associated products
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        // Replace findByIdAndUpdate with update + findByPk
        const [updated] = await Order.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findByPk(req.params.id, {
            include: ['products']
        });

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        // Replace findByIdAndDelete with destroy
        const deleted = await Order.destroy({
            where: { id: req.params.id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};