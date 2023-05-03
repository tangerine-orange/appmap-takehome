const sqlite = require('better-sqlite3');
const generateShortUrlPath = require('./utils/generateShortUrlPath');
const db = require('./db');

db.exec('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT, shortened TEXT)');

const app = require('express')();

app.get('/urls', async (req, res) => {
    const urls = db.prepare('SELECT * FROM urls').all();
    res.json(urls);
});

// :url is expected to be UTF-8 encoded
app.post('/url/:url', async (req, res) => {
    try {
        const { url } = req.params;
        const shortUrlPath = generateShortUrlPath();
        db.prepare('INSERT INTO urls (original, shortened) VALUES (?, ?)').run(url, shortUrlPath);
        res.json({ shortUrlPath });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/urls/:id', async (req, res) => {
    const { id } = req.params;
    const url = db.prepare('SELECT * FROM urls WHERE id = ?').get(id);
    if (url) {
        console.log(url);
        res.json(url);
    } else {
        res.status(404).send('URL not found');
    }
});

module.exports = app;