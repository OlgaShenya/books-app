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

module.exports = { validateBook, VALID_GENRES };
