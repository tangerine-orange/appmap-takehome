const generateShortUrlPath = require('./generateShortUrlPath');

describe('generateShortUrlPath', () => {
  test('returns a string', () => {
    const result = generateShortUrlPath();
    expect(typeof result).toBe('string');
  });

  test('returns a string with length 6', () => {
    const result = generateShortUrlPath();
    expect(result.length).toBe(6);
  });

  test('returns different strings on multiple calls', () => {
    const result1 = generateShortUrlPath();
    const result2 = generateShortUrlPath();
    expect(result1).not.toBe(result2);
  });

  test('returns a URL-safe string', () => {
    const result = generateShortUrlPath();
    expect(result).toMatch(/^[A-Za-z0-9_-]{6}$/);
  });
});
