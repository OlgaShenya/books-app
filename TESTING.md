# Testing Strategy

## Overview

| Type | Tool | Scope | Location |
|------|------|-------|----------|
| Unit | Jest | Individual functions in isolation | `api/src/**/*.test.js` |
| API | Postman / Newman | Full HTTP request/response cycle | `api/tests/` |
| E2E | Playwright *(planned)* | User flows through UI + API | `frontend/tests/` |

---

## Unit Tests

Unit tests verify individual functions **without** starting the server or making HTTP requests.
Framework: **Jest**

### How to run

```bash
cd api
npm test
```

### `store.js` — data layer

| Function | Cases to cover |
|----------|----------------|
| `getAll()` | returns a copy of all books; original array is not mutated |
| `getById(id)` | returns correct book when id exists; returns `undefined` when not found |
| `create(data)` | adds book to store; auto-increments id; returns the new book |
| `update(id, data)` | replaces book fields; preserves id; returns `null` when not found |
| `patch(id, data)` | merges fields; does not overwrite unrelated fields; returns `null` when not found |
| `remove(id)` | removes book from store; returns `true` on success; returns `false` when not found |

### `validateBook()` — validation logic (`books.js`)

| Case | Expected result |
|------|----------------|
| All valid fields | no errors returned |
| Required fields only (title + author) | no errors returned |
| Missing `title` | error: "title is required..." |
| Missing `author` | error: "author is required..." |
| `title` is blank string / spaces only | error: "title is required..." |
| `genre` not in allowed list | error: "genre must be one of..." |
| `rating` below 1 | error: "rating must be between 1 and 5" |
| `rating` above 5 | error: "rating must be between 1 and 5" |
| `year` below 1000 | error: "year must be an integer between 1000 and..." |
| `year` in the future | error: "year must be an integer between 1000 and..." |
| `requireAll = false`, only `genre` provided | validates only genre, ignores missing title/author |

### What is NOT unit tested

- Express routing and middleware — covered by API tests
- HTTP status codes — covered by API tests
- Request/response format — covered by API tests

---

## API Tests

31 test cases covering all endpoints.
Each test checks: **status code + JSON schema + specific field values**.

See `api/tests/books-api-postman-collection.json` for the full collection.

### How to run

**Postman UI:**
1. Open Postman → File → Import → select `api/tests/books-api-postman-collection.json`
2. Click **Run collection**

**Terminal (Newman):**
```bash
npx newman run api/tests/books-api-postman-collection.json
```

> The API must be running before executing tests (`npm start` or `docker compose up`)

### Coverage summary

| Endpoint | Positive | Negative |
|----------|----------|----------|
| `GET /health` | 1 | — |
| `GET /api/books` + filters | 4 | 1 |
| `GET /api/books/:id` | 1 | 2 |
| `POST /api/books` | 2 | 7 |
| `PUT /api/books/:id` | 1 | 3 |
| `PATCH /api/books/:id` | 2 | 3 |
| `DELETE /api/books/:id` | 1 | 2 |
| Unknown route | — | 1 |
| **Total** | **12** | **19** |

---

## What is not covered yet

- **Performance / load testing** — no tests for response time or concurrent requests
- **Security testing** — no tests for auth, injection, or rate limiting (API has no auth yet)
- **E2E testing** — no frontend yet; planned with Playwright once frontend is built
- **Database integration** — current store is in-memory; tests will need a dedicated test DB once a real database is added
