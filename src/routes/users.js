const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../data/store');
const { generateToken, protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/users/login - User login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const user = users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
	if (!user) {
		return res.status(401).json({ message: 'Invalid email or password' });
	}
	const isMatch = await bcrypt.compare(password || '', user.passwordHash);
	if (!isMatch) {
		return res.status(401).json({ message: 'Invalid email or password' });
	}
	res.json({
		id: user.id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
		token: generateToken(user),
	});
});

// POST /api/users - Register user
router.post('/', async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ message: 'Missing required fields' });
	}
	const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
	if (exists) {
		return res.status(400).json({ message: 'User already exists' });
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const newUser = {
		id: uuidv4(),
		name,
		email,
		passwordHash,
		isAdmin: false,
		createdAt: new Date().toISOString(),
	};
	users.push(newUser);
	res.status(201).json({
		id: newUser.id,
		name: newUser.name,
		email: newUser.email,
		isAdmin: newUser.isAdmin,
		token: generateToken(newUser),
	});
});

// GET /api/users/profile - Get user profile
router.get('/profile', protect, (req, res) => {
	const user = req.user;
	res.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin, createdAt: user.createdAt });
});

// PUT /api/users/profile - Update profile
router.put('/profile', protect, async (req, res) => {
	const user = req.user;
	const { name, email, password } = req.body;

	if (email && email !== user.email) {
		const emailTaken = users.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== user.id);
		if (emailTaken) {
			return res.status(400).json({ message: 'Email already in use' });
		}
	}
	if (name != null) user.name = name;
	if (email != null) user.email = email;
	if (password) user.passwordHash = await bcrypt.hash(password, 10);

	res.json({
		id: user.id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
		token: generateToken(user),
	});
});

module.exports = router;