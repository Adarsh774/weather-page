const express = require('express');
const { authors, books } = require('../data/store');

const router = express.Router();

// GET /api/authors - List all authors
router.get('/', (req, res) => {
	res.json(authors);
});

// GET /api/authors/:id/books - Books by author
router.get('/:id/books', (req, res) => {
	const authorId = req.params.id;
	const authorExists = authors.some((a) => a.id === authorId);
	if (!authorExists) {
		return res.status(404).json({ message: 'Author not found' });
	}
	const authorBooks = books.filter((b) => b.authorId === authorId);
	res.json(authorBooks);
});

module.exports = router;