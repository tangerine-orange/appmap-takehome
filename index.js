const app = require('./app');

const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`Running at http://localhost:${PORT}`)
);