const express = require('express');
const { Low, JSONFile } = require('lowdb');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// LowDB সেটআপ
const adapter = new JSONFile('db.json');
const db = new Low(adapter);
await db.read();
db.data ||= { recharges: [] };

// রিচার্জ যোগ করার API
app.post('/recharge', async (req, res) => {
    const { number, amount } = req.body;
    if (!number || !amount) {
        return res.status(400).json({ message: 'Invalid input' });
    }
    db.data.recharges.push({ number, amount, date: new Date().toISOString() });
    await db.write();
    res.status(201).json({ message: 'Recharge added successfully' });
});

// সব রিচার্জ লিস্ট দেখার API
app.get('/recharges', async (req, res) => {
    res.json(db.data.recharges);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});