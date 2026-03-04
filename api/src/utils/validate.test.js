const { validateBook } = require('./validate');

describe('validateBook()', () => {

  // ── requireAll = true (default — used by POST and PUT) ────────────────────

  describe('when requireAll = true (default)', () => {

    it('returns no errors for a fully valid book', () => {
      const errors = validateBook({
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'sci-fi',
        year: 1965,
        rating: 5,
      });
      expect(errors).toHaveLength(0);
    });

    it('returns no errors when only required fields are provided', () => {
      const errors = validateBook({ title: 'My Book', author: 'Jane Doe' });
      expect(errors).toHaveLength(0);
    });

    // title
    it('returns error when title is missing', () => {
      const errors = validateBook({ author: 'Jane Doe' });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('title')]));
    });

    it('returns error when title is a blank string', () => {
      const errors = validateBook({ title: '   ', author: 'Jane Doe' });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('title')]));
    });

    it('returns error when title is not a string', () => {
      const errors = validateBook({ title: 123, author: 'Jane Doe' });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('title')]));
    });

    // author
    it('returns error when author is missing', () => {
      const errors = validateBook({ title: 'My Book' });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('author')]));
    });

    it('returns error when author is a blank string', () => {
      const errors = validateBook({ title: 'My Book', author: '   ' });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('author')]));
    });

    it('returns two errors when both title and author are missing', () => {
      const errors = validateBook({});
      expect(errors).toHaveLength(2);
    });

    // genre
    it('returns no error for a valid genre', () => {
      const errors = validateBook({ title: 'X', author: 'Y', genre: 'fantasy' });
      expect(errors).toHaveLength(0);
    });

    it('returns error for an invalid genre', () => {
      const errors = validateBook({ title: 'X', author: 'Y', genre: 'comics' });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('genre')]));
    });

    // rating
    it('returns no error for rating = 1 (boundary)', () => {
      const errors = validateBook({ title: 'X', author: 'Y', rating: 1 });
      expect(errors).toHaveLength(0);
    });

    it('returns no error for rating = 5 (boundary)', () => {
      const errors = validateBook({ title: 'X', author: 'Y', rating: 5 });
      expect(errors).toHaveLength(0);
    });

    it('returns error when rating is above 5', () => {
      const errors = validateBook({ title: 'X', author: 'Y', rating: 10 });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('rating')]));
    });

    it('returns error when rating is below 1', () => {
      const errors = validateBook({ title: 'X', author: 'Y', rating: 0 });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('rating')]));
    });

    // year
    it('returns error when year is in the future', () => {
      const errors = validateBook({ title: 'X', author: 'Y', year: 2099 });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('year')]));
    });

    it('returns error when year is below 1000', () => {
      const errors = validateBook({ title: 'X', author: 'Y', year: 999 });
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('year')]));
    });

    it('returns no error for year = 1000 (boundary)', () => {
      const errors = validateBook({ title: 'X', author: 'Y', year: 1000 });
      expect(errors).toHaveLength(0);
    });

    it('returns no error for the current year (boundary)', () => {
      const errors = validateBook({ title: 'X', author: 'Y', year: new Date().getFullYear() });
      expect(errors).toHaveLength(0);
    });
  });

  // ── requireAll = false (used by PATCH) ────────────────────────────────────

  describe('when requireAll = false (PATCH mode)', () => {

    it('returns no errors when only a valid genre is provided', () => {
      const errors = validateBook({ genre: 'fantasy' }, false);
      expect(errors).toHaveLength(0);
    });

    it('returns no errors when only rating is provided and is valid', () => {
      const errors = validateBook({ rating: 3 }, false);
      expect(errors).toHaveLength(0);
    });

    it('does not require title when requireAll is false', () => {
      const errors = validateBook({ rating: 3 }, false);
      expect(errors).not.toEqual(expect.arrayContaining([expect.stringContaining('title')]));
    });

    it('does not require author when requireAll is false', () => {
      const errors = validateBook({ rating: 3 }, false);
      expect(errors).not.toEqual(expect.arrayContaining([expect.stringContaining('author')]));
    });

    it('still returns error for invalid genre when requireAll is false', () => {
      const errors = validateBook({ genre: 'comics' }, false);
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('genre')]));
    });

    it('still validates rating when requireAll is false', () => {
      const errors = validateBook({ rating: 10 }, false);
      expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('rating')]));
    });
  });
});
