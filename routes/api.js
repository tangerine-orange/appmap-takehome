const generateShortUrlPath = require('../utils/generateShortUrlPath');

module.exports = (router, db) => {
    router.get('/api/urls', async (req, res) => {
        const urls = db.prepare('SELECT * FROM urls').all();
        res.json(urls);
    });
    
    // :url is expected to be UTF-8 encoded
    router.post('/api/url/:url', async (req, res) => {
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