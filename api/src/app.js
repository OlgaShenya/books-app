const express = require('express');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

// Log every request (handy when learning to test)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// API info
app.get('/', (_req, res) => {
  res.json({
    name: 'Books Catalog API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      listBooks: 'GET /api/books',
      listBooksFiltered: 'GET /api/books?genre=&author=&year=',
      getBook: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      replaceBook: 'PUT /api/books/:id',
      updateBook: 'PATCH /api/books/:id',
      deleteBook: 'DELETE /api/books/:id',
    },
  });
});

app.use('/api/books', booksRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Books API running on http://localhost:${PORT}`);
});

module.exports = app; // exported for testing
