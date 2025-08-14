const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { books, authors, categories } = require('../data/store');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/books - List all books
router.get('/', (req, res) => {
	res.json(books);
});

// GET /api/books/:id - Get single book
router.get('/:id', (req, res) => {
	const book = books.find((b) => b.id === req.params.id);
	if (!book) {
		return res.status(404).json({ message: 'Book not found' });
	}
	res.json(book);
});

// POST /api/books - Create book (admin)
router.post('/', protect, admin, (req, res) => {
	const { title, authorId, categoryId, price, countInStock } = req.body;
	if (!title || !authorId || !categoryId || price == null || countInStock == null) {
		return res.status(400).json({ message: 'Missing required fields' });
	}
	const authorExists = authors.some((a) => a.id === authorId);
	const categoryExists = categories.some((c) => c.id === categoryId);
	if (!authorExists || !categoryExists) {
		return res.status(400).json({ message: 'Invalid authorId or categoryId' });
	}
	const newBook = {
		id: uuidv4(),
		title,
		authorId,
		categoryId,
		price: Number(price),
		countInStock: Number(countInStock),
		reviews: [],
		createdAt: new Date().toISOString(),
	};
	books.push(newBook);
	res.status(201).json(newBook);
});

// PUT /api/books/:id - Update book (admin)
router.put('/:id', protect, admin, (req, res) => {
	const book = books.find((b) => b.id === req.params.id);
	if (!book) {
		return res.status(404).json({ message: 'Book not found' });
	}
	const { title, authorId, categoryId, price, countInStock } = req.body;
	if (title != null) book.title = title;
	if (authorId != null) book.authorId = authorId;
	if (categoryId != null) book.categoryId = categoryId;
	if (price != null) book.price = Number(price);
	if (countInStock != null) book.countInStock = Number(countInStock);
	res.json(book);
});

// DELETE /api/books/:id - Delete book (admin)
router.delete('/:id', protect, admin, (req, res) => {
	const index = books.findIndex((b) => b.id === req.params.id);
	if (index === -1) {
		return res.status(404).json({ message: 'Book not found' });
	}
	const [removed] = books.splice(index, 1);
	res.json({ message: 'Book deleted', book: removed });
});

// GET /api/books/:id/reviews - Get book reviews
router.get('/:id/reviews', (req, res) => {
	const book = books.find((b) => b.id === req.params.id);
	if (!book) {
		return res.status(404).json({ message: 'Book not found' });
	}
	res.json(book.reviews || []);
});

// POST /api/books/:id/reviews - Create review
router.post('/:id/reviews', protect, (req, res) => {
	const book = books.find((b) => b.id === req.params.id);
	if (!book) {
		return res.status(404).json({ message: 'Book not found' });
	}
	const { rating, comment } = req.body;
	if (rating == null || rating < 1 || rating > 5) {
		return res.status(400).json({ message: 'Rating must be between 1 and 5' });
	}
	const alreadyReviewed = (book.reviews || []).some((r) => r.userId === req.user.id);
	if (alreadyReviewed) {
		return res.status(400).json({ message: 'Book already reviewed by this user' });
	}
	const review = {
		userId: req.user.id,
		name: req.user.name,
		rating: Number(rating),
		comment: comment || '',
		createdAt: new Date().toISOString(),
	};
	book.reviews = book.reviews || [];
	book.reviews.push(review);
	res.status(201).json(review);
});

module.exports = router;