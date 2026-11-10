const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

function auth(req, res, next) {

    // Get token from Authorization header
    const authHeader = req.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Missing or invalid token'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        // Verify JWT
        const decoded = jwt.verify(token, SECRET);

        // Attach user information to request
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            error: 'Invalid or expired token'
        });

    }
}

module.exports = auth;