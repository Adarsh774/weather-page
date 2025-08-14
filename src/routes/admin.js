const express = require('express');
const { orders, users } = require('../data/store');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/orders - All orders (admin)
router.get('/orders', protect, admin, (req, res) => {
	res.json(orders);
});

// PUT /api/admin/orders/:id/deliver - Mark as delivered
router.put('/orders/:id/deliver', protect, admin, (req, res) => {
	const order = orders.find((o) => o.id === req.params.id);
	if (!order) {
		return res.status(404).json({ message: 'Order not found' });
	}
	order.isDelivered = true;
	order.deliveredAt = new Date().toISOString();
	res.json(order);
});

// GET /api/admin/users - All users (admin)
router.get('/users', protect, admin, (req, res) => {
	const safeUsers = users.map((u) => ({ id: u.id, name: u.name, email: u.email, isAdmin: u.isAdmin, createdAt: u.createdAt }));
	res.json(safeUsers);
});

module.exports = router;