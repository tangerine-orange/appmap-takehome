const app = require('express')();
const sqlite3 = require('sqlite3');
const open = require('sqlite').open;

const PORT = 8080;

open({ filename: './url_shortener.db', driver: sqlite3.Database }).then((db) => {
    app.listen(
        PORT,
        () => console.log(`Running at http://localhost:${PORT}`)
    );
    
    app.get('/', async (req, res) => {
        let output = "";
        try {
            const rows = await db.all("SELECT id, name FROM urls");
            rows.forEach((row) => {
                output += row.id + " " + row.name + "\n";
            })
            res.status(200).send(output);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    });
    
    // :uri is expected to be UTF-8 encoded
    app.post('/url/:url', (req, res) => {
        const { url } = req.params;
    
        db.run("CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, name TEXT)");
        db.run("INSERT INTO urls (name) VALUES (?)", [url]);
    
        res.status(200).send(url);
    })
});