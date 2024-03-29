const generateShortUrlPath = require('../utils/generateShortUrlPath');
const { hashPassword, comparePassword } = require('../utils/passwords');

module.exports = (router, db) => {
    router.get('/api/urls', async (req, res) => {
        const urls = db.prepare('SELECT * FROM urls').all();
        res.json(urls);
    });
    
    // :url is expected to be UTF-8 encoded
    router.post('/api/url/:url', async (req, res) => {
        try {
            const { url } = req.params;
            const { readPassword = '', writePassword = '' } = req.body;
            const shortened = generateShortUrlPath();
            const hashedReadPassword = await hashPassword(readPassword);
            const hashedWritePassword = await hashPassword(writePassword);
            db.prepare('INSERT INTO urls (original, shortened, readPassword, writePassword) VALUES (?, ?, ?, ?)')
                .run(url, shortened, hashedReadPassword, hashedWritePassword);
            res.json({ shortened });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });
    
    router.post('/api/urls/shortened/:shortened', async (req, res) => {
        const { shortened } = req.params;
        const { readPassword = '', writePassword = '' } = req.body;
        const url = db.prepare('SELECT * FROM urls WHERE shortened = ?').get(shortened);
        if (url) {
            const correctPassword = await comparePassword(readPassword, url.readPassword);
            if (correctPassword) {
                res.json(url);
            } else {
                res.status(401).json({ error: 'Incorrect password' });
            }
        } else {
            res.status(403).send('URL not found');
        }
    });
};