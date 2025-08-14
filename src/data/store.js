const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Seed categories
const categoryFictionId = uuidv4();
const categoryNonFictionId = uuidv4();
const categoryScienceId = uuidv4();

const categories = [
	{ id: categoryFictionId, name: 'Fiction' },
	{ id: categoryNonFictionId, name: 'Non-Fiction' },
	{ id: categoryScienceId, name: 'Science' },
];

// Seed authors
const authorOneId = uuidv4();
const authorTwoId = uuidv4();
const authorThreeId = uuidv4();

const authors = [
	{ id: authorOneId, name: 'Jane Austen' },
	{ id: authorTwoId, name: 'George Orwell' },
	{ id: authorThreeId, name: 'Carl Sagan' },
];

// Seed books
const books = [
	{
		id: uuidv4(),
		title: 'Pride and Prejudice',
		authorId: authorOneId,
		categoryId: categoryFictionId,
		price: 9.99,
		countInStock: 12,
		reviews: [],
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		title: '1984',
		authorId: authorTwoId,
		categoryId: categoryFictionId,
		price: 8.49,
		countInStock: 8,
		reviews: [],
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		title: 'Cosmos',
		authorId: authorThreeId,
		categoryId: categoryScienceId,
		price: 12.99,
		countInStock: 5,
		reviews: [],
		createdAt: new Date().toISOString(),
	},
];

// Seed users
const users = [
	{
		id: uuidv4(),
		name: 'Admin User',
		email: 'admin@example.com',
		passwordHash: bcrypt.hashSync('admin123', 10),
		isAdmin: true,
		createdAt: new Date().toISOString(),
	},
];

// Orders will be created at runtime
const orders = [];

module.exports = { categories, authors, books, users, orders };