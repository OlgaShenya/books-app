// jest.resetModules() in beforeEach gives each test a fresh copy of the
// module — meaning the books array and nextId counter are reset to their
// initial values (5 seed books, nextId = 6) before every test.

describe('store', () => {
  let store;

  beforeEach(() => {
    jest.resetModules();
    store = require('./store');
  });

  // ── getAll() ──────────────────────────────────────────────────────────────

  describe('getAll()', () => {
    it('returns all 5 seed books', () => {
      expect(store.getAll()).toHaveLength(5);
    });

    it('returns an array of objects', () => {
      const books = store.getAll();
      expect(Array.isArray(books)).toBe(true);
      expect(typeof books[0]).toBe('object');
    });

    it('mutating the returned array does not affect the store', () => {
      const books = store.getAll();
      books.push({ id: 99, title: 'Injected' });
      expect(store.getAll()).toHaveLength(5);
    });
  });

  // ── getById() ─────────────────────────────────────────────────────────────

  describe('getById()', () => {
    it('returns the correct book when id exists', () => {
      const book = store.getById(1);
      expect(book).toBeDefined();
      expect(book.id).toBe(1);
      expect(book.title).toBe('The Pragmatic Programmer');
    });

    it('returns undefined when id does not exist', () => {
      expect(store.getById(999)).toBeUndefined();
    });
  });

  // ── create() ──────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('returns the new book with an auto-assigned id', () => {
      const book = store.create({ title: 'New Book', author: 'Author', genre: 'other' });
      expect(book.id).toBeDefined();
      expect(book.title).toBe('New Book');
    });

    it('first created book gets id = 6 (after 5 seed books)', () => {
      const book = store.create({ title: 'First', author: 'A' });
      expect(book.id).toBe(6);
    });

    it('increments id for each subsequent book', () => {
      const book1 = store.create({ title: 'Book 1', author: 'A' });
      const book2 = store.create({ title: 'Book 2', author: 'B' });
      expect(book2.id).toBe(book1.id + 1);
    });

    it('makes the new book retrievable via getById()', () => {
      const created = store.create({ title: 'Find Me', author: 'A' });
      expect(store.getById(created.id)).toEqual(created);
    });

    it('increases the total count by 1', () => {
      store.create({ title: 'Extra', author: 'A' });
      expect(store.getAll()).toHaveLength(6);
    });
  });

  // ── update() ──────────────────────────────────────────────────────────────

  describe('update()', () => {
    it('replaces the book fields and returns the updated book', () => {
      const updated = store.update(1, { title: 'New Title', author: 'New Author', genre: 'classic' });
      expect(updated.title).toBe('New Title');
      expect(updated.author).toBe('New Author');
    });

    it('always preserves the original id', () => {
      const updated = store.update(1, { title: 'X', author: 'Y' });
      expect(updated.id).toBe(1);
    });

    it('the change is reflected in subsequent getById() calls', () => {
      store.update(1, { title: 'Changed', author: 'A' });
      expect(store.getById(1).title).toBe('Changed');
    });

    it('returns null when id does not exist', () => {
      expect(store.update(999, { title: 'X', author: 'Y' })).toBeNull();
    });
  });

  // ── patch() ───────────────────────────────────────────────────────────────

  describe('patch()', () => {
    it('updates only the provided fields', () => {
      const originalTitle = store.getById(1).title;
      const patched = store.patch(1, { rating: 3 });
      expect(patched.rating).toBe(3);
      expect(patched.title).toBe(originalTitle);
    });

    it('does not overwrite the id even if id is passed in data', () => {
      const patched = store.patch(1, { id: 999, rating: 3 });
      expect(patched.id).toBe(1);
    });

    it('the change is reflected in subsequent getById() calls', () => {
      store.patch(1, { rating: 2 });
      expect(store.getById(1).rating).toBe(2);
    });

    it('returns null when id does not exist', () => {
      expect(store.patch(999, { rating: 3 })).toBeNull();
    });
  });

  // ── remove() ──────────────────────────────────────────────────────────────

  describe('remove()', () => {
    it('returns true when book is successfully removed', () => {
      expect(store.remove(1)).toBe(true);
    });

    it('the removed book is no longer findable via getById()', () => {
      store.remove(1);
      expect(store.getById(1)).toBeUndefined();
    });

    it('reduces total count by 1', () => {
      store.remove(1);
      expect(store.getAll()).toHaveLength(4);
    });

    it('returns false when id does not exist', () => {
      expect(store.remove(999)).toBe(false);
    });

    it('does not change the count when id does not exist', () => {
      store.remove(999);
      expect(store.getAll()).toHaveLength(5);
    });
  });
});
