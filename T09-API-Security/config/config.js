const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error('JWT_SECRET is missing in .env file');
}

module.exports = { SECRET };