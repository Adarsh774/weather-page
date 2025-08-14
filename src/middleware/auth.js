const jwt = require('jsonwebtoken');
const { users } = require('../data/store');

const getJwtSecret = () => process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

const generateToken = (user) => {
	return jwt.sign(
		{ id: user.id, isAdmin: user.isAdmin },
		getJwtSecret(),
		{ expiresIn: '30d' }
	);
};

const protect = (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return res.status(401).json({ message: 'Not authorized, no token' });
	}

	try {
		const decoded = jwt.verify(token, getJwtSecret());
		const user = users.find((u) => u.id === decoded.id);
		if (!user) {
			return res.status(401).json({ message: 'Not authorized, user missing' });
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Not authorized, token failed' });
	}
};

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		return next();
	}
	return res.status(403).json({ message: 'Admin access only' });
};

module.exports = { protect, admin, generateToken };