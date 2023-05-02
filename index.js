const app = require('express')();
const sqlite3 = require('sqlite3');
const open = require('sqlite').open;

const PORT = 8080;

open({ filename: './url_shortener.db', driver: sqlite3.Database }).then((db) => {
    db.run('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT, shortened TEXT)');


    app.get('/urls', async (req, res) => {
        const urls = await db.all('SELECT * FROM urls');
        res.json(urls);
    });
    
    // :url is expected to be UTF-8 encoded
    app.post('/url/:url', async (req, res) => {
        const { url } = req.params;
        await db.run('INSERT INTO urls (url) VALUES (?)', url);
        res.sendStatus(201);
    })

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