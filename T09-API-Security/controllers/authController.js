const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { findUserByEmail } = require('../models/userModel');

const SECRET = process.env.JWT_SECRET;

// Login Controller
function login(req, res) {

    const { email, password } = req.body;

    // Find user
    const user = findUserByEmail(email);

    // Verify credentials
    if (!user || !bcrypt.compareSync(password, user.hash)) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }

    // Generate JWT
    const token = jwt.sign(
        {
            sub: user.id,
            role: user.role
        },
        SECRET,
        {
            expiresIn: '1h'
        }
    );

    // Return token
    res.json({ token });
}

module.exports = { login };