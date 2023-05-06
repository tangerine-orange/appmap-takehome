const generateShortUrlPath = require('../utils/generateShortUrlPath');
const bcrypt = require("bcrypt")

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

module.exports = (router, db) => {
    router.get('/api/urls', async (req, res) => {
        const urls = db.prepare('SELECT * FROM urls').all();
        res.json(urls);
    });
    
    // :url is expected to be UTF-8 encoded
    router.post('/api/url/:url', async (req, res) => {
        try {
            const { url } = req.params;
            const { readPassword, writePassword } = req.body;
            const shortUrlPath = generateShortUrlPath();
            const hashedReadPassword = readPassword ? await hashPassword(readPassword) : '';
            const hashedWritePassword = writePassword ? await hashPassword(writePassword) : '';
            db.prepare('INSERT INTO urls (original, shortened, readPassword, writePassword) VALUES (?, ?, ?, ?)')
                .run(url, shortUrlPath, hashedReadPassword, hashedWritePassword);
            res.json({ shortUrlPath });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });
    
    router.get('/api/urls/:shortened', async (req, res) => {
        const { shortened } = req.params;
        const url = db.prepare('SELECT * FROM urls WHERE shortened = ?').get(shortened);
        if (url) {
            console.log(url);
            res.json(url);
        } else {
            res.status(404).send('URL not found');
        }
    });
};