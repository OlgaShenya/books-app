const { Router } = require('express');
const store = require('../data/store');
const { validateBook } = require('../utils/validate');

const router = Router();

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
