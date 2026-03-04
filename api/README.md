# Books API

A simple REST API built with Node.js and Express for QA learning and API testing practice.  
Data is stored in memory — no database required.

---

## Project structure

```
books-api/
├── src/                        # API source code
│   ├── app.js                  # Express entry point
│   ├── routes/
│   │   └── books.js            # Route handlers & validation
│   └── data/
│       └── store.js            # In-memory data store (5 seed books)
├── tests/                      # All testing artifacts
│   ├── books-api-postman-collection.json
│   └── test-cases.csv
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## Endpoints

| Method   | URL                        | Description              |
|----------|----------------------------|--------------------------|
| `GET`    | `/health`                  | Health check             |
| `GET`    | `/api/books`               | List all books           |
| `GET`    | `/api/books?genre=sci-fi`  | Filter by genre          |
| `GET`    | `/api/books?author=frank`  | Filter by author (partial)|
| `GET`    | `/api/books?year=1965`     | Filter by year           |
| `GET`    | `/api/books/:id`           | Get one book             |
| `POST`   | `/api/books`               | Create a book            |
| `PUT`    | `/api/books/:id`           | Full replace             |
| `PATCH`  | `/api/books/:id`           | Partial update           |
| `DELETE` | `/api/books/:id`           | Delete a book            |

### Book fields

| Field    | Type    | Required | Validation                              |
|----------|---------|----------|-----------------------------------------|
| `title`  | string  | yes      | non-empty                               |
| `author` | string  | yes      | non-empty                               |
| `genre`  | string  | no       | one of: technology, sci-fi, dystopia, classic, fantasy, biography, other |
| `year`   | integer | no       | 1000 – current year                     |
| `rating` | number  | no       | 1 – 5                                   |

---

## Running the API

### Option 1 — Node.js

```bash
npm install
npm start
```

### Option 2 — Docker

```bash
docker compose up --build
```

API runs at **http://localhost:3000**

---

## Testing

### Import into Postman
1. Open Postman → **File → Import**
2. Select `books-api-postman-collection.json`
3. Run individual requests or use **Collection Runner** to run all 31 tests at once

### Run from terminal with Newman
```bash
npx newman run tests/books-api-postman-collection.json
```

---

## Test cases

`tests/test-cases.csv` contains 31 test cases (positive & negative) with expected status codes and JSON schemas.
