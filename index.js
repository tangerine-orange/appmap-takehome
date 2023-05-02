const app = require('express')();
const sqlite3 = require('sqlite3');
const open = require('sqlite').open;
const generateShortUrlPath = require('./generateShortUrlPath');

const PORT = 8080;

open({ filename: './url_shortener.db', driver: sqlite3.Database }).then((db) => {
    db.run('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT, short TEXT)');


    app.get('/urls', async (req, res) => {
        const urls = await db.all('SELECT * FROM urls');
        res.json(urls);
    });
    
    // :url is expected to be UTF-8 encoded
    app.post('/url/:url', async (req, res) => {
        try {
            const { url } = req.params;
            const shortUrlPath = generateShortUrlPath();
            await db.run('INSERT INTO urls (original, shortened) VALUES (?, ?)', [url, shortUrlPath]);
            res.json({ shortUrlPath });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

    app.get('/urls/:id', async (req, res) => {
        const { id } = req.params;
        const url = await db.get('SELECT * FROM urls WHERE id = ?', id);
        if (url) {
          res.json(url);
        } else {
          res.status(404).send('URL not found');
        }
    });

    app.listen(
        PORT,
        () => console.log(`Running at http://localhost:${PORT}`)
    );
});