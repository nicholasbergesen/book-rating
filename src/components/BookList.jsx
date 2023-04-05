import React from 'react';
import { useEffect, useState } from "react";

function BookList({ books }) {
  const [bookRatings, setBookRatings] = useState({});
  const [loaded, setLoaded] = useState(false);

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

            if (ratings.length > 1) {
              const minRating = ratings[0];
              const maxRating = ratings[ratings.length - 1];
              if (minRating === maxRating) return { [book.title]: minRating }; // no need to show range (e.g. 4..4
              const rating = `${minRating}..${maxRating}`;
              return { [book.title]: rating };
            } else if (ratings.length === 1) {
              return { [book.title]: ratings[0] };
            } else {
              return { [book.title]: -1 };
            }
          })
      );
      const ratings = await Promise.all(promises);
      const ratingsMap = ratings.reduce((acc, rating) => ({ ...acc, ...rating }), {});
      setBookRatings(ratingsMap);
      setLoaded(true);
    }

    fetchBookRatings();
  }, [books]);

  const sortedBooks = books.sort((a, b) => {
    const aRating = bookRatings[a.title];
    const bRating = bookRatings[b.title];

    if (aRating == null && bRating != null) {
      return 1;
    } else if (aRating != null && bRating == null) {
      return -1;
    } else if (aRating == null && bRating == null) {
      return 0;
    } else {
      const aRatingMin = typeof aRating === 'string' ? aRating?.split("..")[0] : aRating || 0;
      const bRatingMin = typeof bRating === 'string' ? bRating?.split("..")[0] : bRating || 0;
      return bRatingMin - aRatingMin;
    }
  });


  return loaded ? (
    <ul style={{listStyle: "none"}}>
      {sortedBooks.map((book) => (
        <li key={book.title}>
          {book.title} ({bookRatings[book.title] !== -1 ? bookRatings[book.title] : "no rating"})
        </li>
      ))}
    </ul>
  ) : (<div>loading...</div>)
}

export default BookList