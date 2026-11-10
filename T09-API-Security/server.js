// Load environment variables first
require('dotenv').config();

const express = require('express');

const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/items', itemRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'CampusEats API Security Server Running'
    });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Secured Catalogue running on http://localhost:${PORT}`);
});