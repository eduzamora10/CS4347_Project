import React from 'react';

export function Book_L({ books }) {
  return (
    <div className="book-list-container">
      <h2>Search Results</h2>
      <div className="book-list">
        {books.map((book, index) => (
          <div key={index} className="book-card">
            <div className="book-info">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Publisher, Year:</strong> {book.publisher}, {book.year}</p>
              <p>{book.description}</p>
              <button className="checkout-button">Add to Checkout</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Book_L;
