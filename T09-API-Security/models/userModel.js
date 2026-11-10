const bcrypt = require('bcryptjs');

// Demo users
const users = [
    {
        id: 1,
        email: 'asha@campus.edu',
        role: 'customer',
        hash: bcrypt.hashSync('customer123', 10)
    },
    {
        id: 2,
        email: 'mealhub@campus.edu',
        role: 'restaurant',
        hash: bcrypt.hashSync('resto123', 10)
    }
];

// Find user by email
function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

// Export functions
module.exports = {
    users,
    findUserByEmail
};