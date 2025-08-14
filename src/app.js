const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const booksRouter = require('./routes/books');
const categoriesRouter = require('./routes/categories');
const authorsRouter = require('./routes/authors');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const adminRouter = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.json({ message: 'Bookstore API is running' });
});

app.use('/api/books', booksRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
	const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
	res.status(status).json({
		message: err.message || 'Server Error',
		stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
	});
});

module.exports = app;