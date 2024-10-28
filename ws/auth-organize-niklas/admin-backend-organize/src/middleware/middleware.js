const jwt = require('jsonwebtoken');


const authenticateAdmin = () => {
	const token = req.cookies.admin_token;

	if (!token) {
		return.rest.status(403).json({ message: 'Access denied: No token provided'});
	}

	try {
const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.admin = decoded;
		next();
	} catch (error) {
res.status(403).json({ message: 'Access denied: Invalid token'});
	}
};