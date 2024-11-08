import React from 'react';


export function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome to UTD's Student Library System!</h1>
        <p>
          Welcome! You are invited to search for books in our collection based on various criteria,
          including title, author, genre, ISBN, publisher, and publication year. Feel free to explore and
          discover your next great read!
        </p>
      </header>

      <div className="search-section">
        <form className="search-form">
          <input type="text" placeholder="Title Name" />
          <input type="text" placeholder="Author Name" />
          <input type="text" placeholder="Genre Name" />
          <input type="text" placeholder="ISBN" />
          <input type="text" placeholder="Publisher" />
          <input type="number" placeholder="Publication Year" />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="book-list">
        <BookCard 
          title="What is Computer Science?" 
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu volutpat nunc." 
          id="1" 
        />
        <BookCard 
          title="Getting Started with SQL" 
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu volutpat nunc." 
          id="2" 
        />
        <BookCard 
          title="Calculus: An Intuitive and Physical Approach" 
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu volutpat nunc." 
          id="3" 
        />
        {/* Add more BookCard components as needed */}
      </div>
    </div>
  );
}

function BookCard({ title, description, id }) {
  return (
    <div className="book-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="checkout-button">Add to Checkout</button>
    </div>
  );
}

export default Home;