Start server:
```
npm start
```

In another terminal tab, start client:
```
cd client
npm start
```

---

The api is hosted at https://appmap-takehome.herokuapp.com/ and the client is hosted at https://appmap-takehome-client.herokuapp.com/

---

This app allows users to input any URL, and get a "shortened" URL in return. In reality, our domain name is fairly long, so the "shortened" URL might not actually be shorter, but if we productionized this we would certainly buy a short domain name to use.

---
The app uses a sqlite3 database with one table, `urls`, which has the following schema:

|`original TEXT`|`shortened TEXT`|`readPassword TEXT`|`writePassword TEXT`|
|------|------|------|------|

`original`: is always set to the input URL. The server expects the frontend to escape the characters for clean transmission over HTTP, but the string is stored in the database in its original form.

`shortened`: is a random 6 character string, created by generating a 4-byte random stream, converting to base64, and encoding as a string. We are indexing on this field.

`readPassword`: is the given `readPassword`, defaulted to `''`, then salted and hashed by `bcrypt`

`writePassword`: is the given `writePassword`, defaulted to `''`, then salted and hashed by `bcrypt`

---
The app uses an express server to handle the following routes:

`GET /api/urls () → [ urls: { original, shortened, readPassword, writePassword } ]` Returns an array containing all of the shortened URLs. This endpoint would be removed before productionizing, or at least put behind admin access.

`POST /api/url/:url (readPassword? = '', writePassword? = '') → { shortened }` Creates a shortened URL with `original = params.url`, and returns the 6 character random string. 

`POST '/api/urls/shortened/:shortened' (readPassword? = '', writePassword? = '') → url` Fetches the `url` from the `urls` table that matches `params.shortened`. Returns `status = 401` if the `readPassword` is incorrect.

---
TODO
- Chance of collision is around 4 x 10<sup>9</sup>, but we should still handle collisions when they do occur. We can do this by checking the database for other entries with the generated random string. This shouldn't take long because we have an index on `shortened`. If we find a match, then we generate the string again.
- Add write password functionality. This would allow users to delete entries that they made.
- Make a dedicated db
- Add linting for backend and client
- Possibly separate backend and client into their own codebases
- [Feature] Add time limits for URLs