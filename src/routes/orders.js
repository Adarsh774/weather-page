const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { orders, books } = require('../data/store');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Create new order
router.post('/', protect, (req, res) => {
	const { orderItems } = req.body;
	if (!Array.isArray(orderItems) || orderItems.length === 0) {
		return res.status(400).json({ message: 'Order items are required' });
	}

	// Validate items and stock
	const items = [];
	for (const item of orderItems) {
		const { bookId, qty } = item;
		const book = books.find((b) => b.id === bookId);
		if (!book) {
			return res.status(400).json({ message: `Invalid bookId: ${bookId}` });
		}
		const quantity = Number(qty || 0);
		if (quantity <= 0) {
			return res.status(400).json({ message: 'Quantity must be greater than 0' });
		}
		if (book.countInStock < quantity) {
			return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
		}
		items.push({ bookId: book.id, title: book.title, qty: quantity, price: book.price });
	}

	// Deduct stock
	for (const item of items) {
		const book = books.find((b) => b.id === item.bookId);
		book.countInStock -= item.qty;
	}

	const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);

	const order = {
		id: uuidv4(),
		userId: req.user.id,
		orderItems: items,
		totalPrice,
		isDelivered: false,
		deliveredAt: null,
		createdAt: new Date().toISOString(),
	};
	orders.push(order);
	res.status(201).json(order);
});

// GET /api/orders/myorders - Get logged in user's orders
router.get('/myorders', protect, (req, res) => {
	const myOrders = orders.filter((o) => o.userId === req.user.id);
	res.json(myOrders);
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', protect, (req, res) => {
	const order = orders.find((o) => o.id === req.params.id);
	if (!order) {
		return res.status(404).json({ message: 'Order not found' });
	}
	if (order.userId !== req.user.id && !req.user.isAdmin) {
		return res.status(403).json({ message: 'Access denied' });
	}
	res.json(order);
});

module.exports = router;