import React from 'react';
import { useEffect, useState } from "react";

function BookList({ books }) {
  const [bookRatings, setBookRatings] = useState({});

  useEffect(() => {
    async function fetchBookRatings() {
      const promises = books.map((book) =>
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.title)}`)
          .then((response) => response.json())
          .then((data) => {
            const items = data.items || [];
            const ratings = items
              .filter((item) => item.volumeInfo?.title === book.title)
              .map((item) => item.volumeInfo?.averageRating)
              .filter((rating) => rating !== undefined && rating !== null)
              .sort((a, b) => a - b);
            const rating = ratings.length > 0 ? `${ratings[0]}..${ratings[ratings.length - 1]}` : null;
            return { [book.title]: rating };
          })
      );
      const ratings = await Promise.all(promises);
      const ratingsMap = ratings.reduce((acc, rating) => ({ ...acc, ...rating }), {});
      setBookRatings(ratingsMap);
    }

    fetchBookRatings();
  }, [books]);

  const sortedBooks = books.sort((a, b) => {
    const aRating = bookRatings[a.title];
    const bRating = bookRatings[b.title];
    if (aRating === null && bRating !== null) {
      return 1;
    } else if (aRating !== null && bRating === null) {
      return -1;
    } else if (aRating === null && bRating === null) {
      return 0;
    } else {
      const aRatingMin = aRating?.split("..")[0] || 0;
      const bRatingMin = bRating?.split("..")[0] || 0;
      return bRatingMin - aRatingMin;
    }
  });


  return (
    <ul>
      {sortedBooks.map((book) => (
        <li key={book.title}>
          {book.title} ({bookRatings[book.title] !== null ? bookRatings[book.title] : "(not found)"})
        </li>
      ))}
    </ul>
  );
}

export default BookList