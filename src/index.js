import React from 'react';
import ReactDOM from 'react-dom';
import BookList from './components/BookList';

const books = [
  { title: 'The Great Gatsby' },
  { title: 'To Kill a Mockingbird' },
  { title: '1984' },
  { title: 'Pride and Prejudice' },
  { title: 'The Catcher in the Rye' }
];

ReactDOM.render(
  <BookList books={books} />,
  document.getElementById('root')
);
