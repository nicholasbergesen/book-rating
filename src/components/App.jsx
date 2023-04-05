import React from 'react';
import BookList from './BookList';
import { useState } from "react";

function App() {
    const [myBooks, setMyBooks] = useState([])
    const [bookText, setBookText] = useState('The Great Gatsby\nTo Kill a Mockingbird\n1984\nPride and Prejudice\nThe Catcher in the Rye')

    const handleChange = (event) => {
        setBookText(event.target.value);
    }

    const getRatings = () => {
        const lines = bookText.split("\n");
        const books = lines.map(line => ({ title: line }));
        setMyBooks(books)
    }

    return (
        <div>
            <style>{`
                .book-text {
                    width: 20em;
                    height: 10em;
                }`}
            </style>
            <textarea value={bookText} onChange={handleChange} className='book-text' />
            <div>
                <button onClick={getRatings}>Get ratings</button>
            </div>
            <BookList books={myBooks} />
        </div>
    )
}

export default App