const request = require('supertest');
const app = require('./app');
const sqlite = require('better-sqlite3');
const db = require('./db')


jest.mock('./utils/generateShortUrlPath'); // add this line to replace the implementation with the mocked version

const generateShortUrlPath = require('./utils/generateShortUrlPath'); // add this line to import the real implementation
generateShortUrlPath.mockReturnValue('abc123'); // modify this line to set the return value of the mocked version

beforeEach(() => {
    generateShortUrlPath.mockClear();
    db.prepare(`DROP TABLE IF EXISTS urls`).run();
    db.exec('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT, shortened TEXT)');
});

afterAll(() => {
    db.close();
});

describe('GET /urls', () => {
    test('returns an empty array when there are no URLs', async () => {
        const response = await request(app).get('/urls');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('returns an array of URLs when there are URLs in the database', async () => {
        // Insert some URLs into the database
        db.prepare('INSERT INTO urls (original, shortened) VALUES (?, ?)').run('https://www.example.com', 'abc123');
        db.prepare('INSERT INTO urls (original, shortened) VALUES (?, ?)').run('https://www.google.com', 'def456');
    
        const response = await request(app).get('/urls');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
          { id: 1, original: 'https://www.example.com', shortened: 'abc123' },
          { id: 2, original: 'https://www.google.com', shortened: 'def456' }
        ]);
    });

    describe('POST /url/:url', () => {
        test('returns a short URL path when given a valid URL', async () => {
            const response = await request(app).post('/url/https%3A%2F%2Fwww.example.com');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ shortUrlPath: 'abc123' });
        
            const all = await request(app).get('/urls');

            // Verify that the URL was inserted into the database
            const url = db.prepare('SELECT * FROM urls WHERE original = ?').get('https://www.example.com');
            expect(url).toEqual({ id: 1, original: 'https://www.example.com', shortened: 'abc123' });
        });
    });

    describe('GET /urls/:id', () => {
        test('returns a URL when given a valid ID', async () => {
          // Insert a URL into the database
          db.prepare('INSERT INTO urls (original, shortened) VALUES (?, ?)').run('https://www.example.com', 'abc123');
      
          const response = await request(app).get('/urls/1');
          expect(response.status).toBe(200);
          expect(response.body).toEqual({ id: 1, original: 'https://www.example.com', shortened: 'abc123' });
        });
      
        test('returns a 404 error when given an invalid ID', async () => {
            const all = await request(app).get('/urls');
          const response = await request(app).get('/urls/1');
          expect(response.status).toBe(404);
          expect(response.text).toBe('URL not found');
        });
    });
    
});