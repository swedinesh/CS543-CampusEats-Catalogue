const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let items = [
    { id: 1, name: 'Veg Thali', price: 90, veg: true },
    { id: 2, name: 'Paneer Roll', price: 70, veg: true },
    { id: 3, name: 'Chicken Burger', price: 120, veg: false },
    { id: 4, name: 'Masala Dosa', price: 60, veg: true }
];

let nextId = 5;

// GET all items with optional veg filter
app.get('/items', (req, res) => {
    const { veg } = req.query;

    let result = items;

    if (veg === 'true') {
        result = items.filter(item => item.veg === true);
    } else if (veg === 'false') {
        result = items.filter(item => item.veg === false);
    }

    res.json(result);
});

// GET item by ID
app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === Number(req.params.id));

    if (!item) {
        return res.status(404).json({ error: 'not found' });
    }

    res.json(item);
});

// POST new item
app.post('/items', (req, res) => {
    const { name, price, veg } = req.body;

    if (!name || !String(name).trim()) {
        return res.status(422).json({ error: 'name required' });
    }

    const item = {
        id: nextId++,
        name: String(name).trim(),
        price: Number(price) || 0,
        veg: veg === true || veg === 'true'
    };

    items.push(item);

    res.status(201).json(item);
});

// DELETE item by ID
app.delete('/items/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'not found' });
    }

    items.splice(index, 1);

    res.status(204).send();
});

app.listen(3000, () => {
    console.log('Catalogue running on http://localhost:3000');
});