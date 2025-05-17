const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(express.json());

// Initialize data structure
db.defaults({ recharges: [] }).write();

// POST endpoint to create recharge
app.post('/recharge', (req, res) => {
    const { number, amount } = req.body;
    if (!number || !amount) {
        return res.status(400).json({ error: 'Missing number or amount' });
    }
    const recharge = { id: Date.now(), number, amount };
    db.get('recharges').push(recharge).write();
    res.json({ success: true, recharge });
});

// GET endpoint to list recharges
app.get('/recharges', (req, res) => {
    const recharges = db.get('recharges').value();
    res.json(recharges);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});