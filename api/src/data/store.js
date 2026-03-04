let nextId = 6;

const books = [
  {
    id: 1,
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    genre: 'technology',
    year: 1999,
    rating: 5,
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'technology',
    year: 2008,
    rating: 5,
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'sci-fi',
    year: 1965,
    rating: 5,
  },
  {
    id: 4,
    title: '1984',
    author: 'George Orwell',
    genre: 'dystopia',
    year: 1949,
    rating: 5,
  },
  {
    id: 5,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'classic',
    year: 1925,
    rating: 4,
  },
];

const getAll = () => [...books];

const getById = (id) => books.find((b) => b.id === id);

const create = (data) => {
  const book = { id: nextId++, ...data };
  books.push(book);
  return book;
};

const update = (id, data) => {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return null;
  books[index] = { id, ...data };
  return books[index];
};

const patch = (id, data) => {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...data, id };
  return books[index];
};

const remove = (id) => {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, patch, remove };
