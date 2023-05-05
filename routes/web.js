module.exports = (router, db) => {
    router.get('/', async (req, res) => {
        res.json("Hello World");
    });
};