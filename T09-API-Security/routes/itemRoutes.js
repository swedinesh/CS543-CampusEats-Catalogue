const express = require('express');
const router = express.Router();

// Import middleware
const auth = require('../middleware/auth');
const requireRole = require('../middleware/authorize');

// Existing Catalogue data
let items = [
    { id: 1, name: 'Veg Thali', price: 90, veg: true },
    { id: 2, name: 'Paneer Roll', price: 70, veg: true },
    { id: 3, name: 'Chicken Burger', price: 120, veg: false },
    { id: 4, name: 'Masala Dosa', price: 60, veg: true }
];

let nextId = 5;


// GET all items
router.get('/', auth, (req, res) => {

    const { veg } = req.query;

    let result = items;

    if (veg === 'true') {
        result = items.filter(item => item.veg === true);
    }
    else if (veg === 'false') {
        result = items.filter(item => item.veg === false);
    }

    res.json(result);
});


// GET item by ID
router.get('/:id', auth, (req, res) => {

    const item = items.find(
        i => i.id === Number(req.params.id)
    );

    if (!item) {
        return res.status(404).json({
            error: 'Item not found'
        });
    }

    res.json(item);
});


// POST new item
router.post(
    '/',
    auth,
    requireRole('restaurant', 'admin'),
    (req, res) => {

        const { name, price, veg } = req.body;

        if (!name || !String(name).trim()) {
            return res.status(422).json({
                error: 'Name required'
            });
        }

        const item = {
            id: nextId++,
            name: String(name).trim(),
            price: Number(price) || 0,
            veg: veg === true || veg === 'true'
        };

        items.push(item);

        res.status(201).json(item);
    }
);


// DELETE item
router.delete(
    '/:id',
    auth,
    requireRole('restaurant', 'admin'),
    (req, res) => {

        const id = Number(req.params.id);

        const index = items.findIndex(
            item => item.id === id
        );

        if (index === -1) {
            return res.status(404).json({
                error: 'Item not found'
            });
        }

        items.splice(index, 1);

        res.status(204).send();
    }
);


module.exports = router;