const express = require('express');
const { categories, books } = require('../data/store');

const router = express.Router();

// GET /api/categories - List all categories
router.get('/', (req, res) => {
	res.json(categories);
});

// GET /api/categories/:id/books - Books by category
router.get('/:id/books', (req, res) => {
	const categoryId = req.params.id;
	const categoryExists = categories.some((c) => c.id === categoryId);
	if (!categoryExists) {
		return res.status(404).json({ message: 'Category not found' });
	}
	const categoryBooks = books.filter((b) => b.categoryId === categoryId);
	res.json(categoryBooks);
});

module.exports = router;