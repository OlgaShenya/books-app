const { Router } = require('express');
const store = require('../data/store');

const router = Router();

// Validation helper
const VALID_GENRES = ['technology', 'sci-fi', 'dystopia', 'classic', 'fantasy', 'biography', 'other'];

function validateBook(body, requireAll = true) {
  const errors = [];

  if (requireAll || body.title !== undefined) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    }
  }
  if (requireAll || body.author !== undefined) {
    if (!body.author || typeof body.author !== 'string' || body.author.trim() === '') {
      errors.push('author is required and must be a non-empty string');
    }
  }
  if (body.genre !== undefined && !VALID_GENRES.includes(body.genre)) {
    errors.push(`genre must be one of: ${VALID_GENRES.join(', ')}`);
  }
  if (body.year !== undefined) {
    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear()) {
      errors.push(`year must be an integer between 1000 and ${new Date().getFullYear()}`);
    }
  }
  if (body.rating !== undefined) {
    const rating = Number(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('rating must be a number between 1 and 5');
    }
  }

  return errors;
}

// GET /api/books — list all books, optional query filters: ?genre=&author=&year=
router.get('/', (req, res) => {
  let result = store.getAll();

  if (req.query.genre) {
    result = result.filter((b) => b.genre === req.query.genre);
  }
  if (req.query.author) {
    const q = req.query.author.toLowerCase();
    result = result.filter((b) => b.author.toLowerCase().includes(q));
  }
  if (req.query.year) {
    result = result.filter((b) => b.year === Number(req.query.year));
  }

  res.json({ total: result.length, data: result });
});

// GET /api/books/:id — get single book
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'id must be an integer' });
  }

  const book = store.getById(id);
  if (!book) {
    return res.status(404).json({ error: `Book with id ${id} not found` });
  }

  res.json(book);
});

// POST /api/books — create a new book
router.post('/', (req, res) => {
  const errors = validateBook(req.body, true);
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const { title, author, genre = 'other', year, rating } = req.body;
  const book = store.create({ title: title.trim(), author: author.trim(), genre, year, rating });

  res.status(201).json(book);
});

// PUT /api/books/:id — full replace
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'id must be an integer' });
  }

  if (!store.getById(id)) {
    return res.status(404).json({ error: `Book with id ${id} not found` });
  }

  const errors = validateBook(req.body, true);
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const { title, author, genre = 'other', year, rating } = req.body;
  const book = store.update(id, { title: title.trim(), author: author.trim(), genre, year, rating });

  res.json(book);
});

// PATCH /api/books/:id — partial update
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'id must be an integer' });
  }

  if (!store.getById(id)) {
    return res.status(404).json({ error: `Book with id ${id} not found` });
  }

  if (!Object.keys(req.body).length) {
    return res.status(400).json({ error: 'Request body must not be empty' });
  }

  const errors = validateBook(req.body, false);
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const book = store.patch(id, req.body);
  res.json(book);
});

// DELETE /api/books/:id — remove a book
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'id must be an integer' });
  }

  const deleted = store.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: `Book with id ${id} not found` });
  }

  res.status(204).send();
});

module.exports = router;
