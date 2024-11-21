import mysql from 'mysql2';
import express from 'express';
import session from 'express-session'
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "1gyvFaMIcdKxWJ2Ezep6",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true for HTTPS
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Database connection setup
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'soccer',
    database: '4347_db'
});

db.connect((error) => {
    if (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit if database connection fails
    }
    console.log("Connected to the database successfully!");
});

// Serve HTML pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../start.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../home.html"));
});

app.get("/book_mgmnt", (req, res) => {
    res.sendFile(path.join(__dirname, "../book_mgmnt.html"));
});

app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "../checkout.html"));
});

app.get("/book_list", (req, res) => {
    res.sendFile(path.join(__dirname, "../book_list.html"));
});

// Handle login POST request (Allows SQL Injection)
app.post("/", (req, res) => {
    const { id, password, userType } = req.body;
    req.session.userId = id; // set session id
    
    // Directly embedding variables into the query string without parameterization.
    const query = `SELECT * FROM authentification_system WHERE username = '${id}' AND password = '${password}' AND user_type = '${userType}'`;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error("Login query error:", error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            res.redirect("/home");
        } else {
            res.redirect("/?error=invalid_credentials");
        }
    });
});

// Handle login POST request (Prevents SQL Injection)
// app.post("/", (req, res) => {
//     const { id, password, userType } = req.body;

//     // Use parameterized query to avoid SQL injection
//     const query = `SELECT * FROM authentification_system WHERE username = ? AND password = ? AND user_type = ?`;

//     // Execute the query with parameters
//     db.query(query, [id, password, userType], (error, results) => {
//         if (error) {
//             console.error("Login query error:", error);
//             return res.status(500).send('Internal Server Error');
//         }

//         if (results.length > 0) {
//             res.redirect("/home");
//         } else {
//             res.redirect("/?error=invalid_credentials");
//         }
//     });
// });



// Book API routes
app.get("/api/books", (req, res) => {
    const sql = "SELECT * FROM books";
    db.query(sql, (error, results) => {
        if (error) {
            console.error("Error retrieving books:", error);
            return res.status(500).send("Failed to retrieve books.");
        }
        res.json(results);
    });
});

app.post("/api/books", (req, res) => {
    const { isbn, title, author, availability, genre, pub_id, staff_id } = req.body;

    // Ensure all required fields are provided
    if (!isbn || !title || !author || !availability || !genre || !pub_id || !staff_id) {
        return res.status(400).send("All book details must be provided.");
    }

    const sql = "INSERT INTO books (isbn, title, author, availability, genre, pub_id, staff_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [isbn, title, author, availability, genre, pub_id, staff_id], (error, result) => {
        if (error) {
            console.error("Error adding book:", error);
            return res.status(500).send("Failed to add book.");
        }
        res.status(201).json({ id: result.insertId, isbn, title, author, availability, genre, pub_id, staff_id });
    });
});

// PUT update book by ISBN (Allows SQL Injection)
app.put("/api/books/:isbn", (req, res) => {
    const { isbn } = req.params;
    const {title, author, genre, pub_id, availability, staff_id } = req.body;
    
    // SQL query to update the book details
    const sql = `UPDATE books SET title = '${title}', author = '${author}', genre = '${genre}', pub_id = '${pub_id}', availability = '${availability}', staff_id = '${staff_id}' WHERE isbn = '${isbn}'`;
    
    // Execute the query with values from the request body and isbn
    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error updating book:", error);
            return res.status(500).send("Failed to update book.");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Book not found.");
        }
        res.status(200).json({ message: "Book updated successfully" });
    });
});

// PUT update book by ISBN (Prevents SQL Injection)
// app.put("/api/books/:isbn", (req, res) => {
//     const { isbn } = req.params;
//     const { title, author, genre, pub_id, availability, staff_id } = req.body;
    
//     // SQL query to update the book details
//     const sql = "UPDATE books SET title = ?, author = ?, genre = ?, pub_id = ?, availability = ?, staff_id = ? WHERE isbn = ?";
    
//     // Execute the query with values from the request body and isbn
//     db.query(sql, [title, author, genre, pub_id, availability, staff_id, isbn], (error, result) => {
//         if (error) {
//             console.error("Error updating book:", error);
//             return res.status(500).send("Failed to update book.");
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).send("Book not found.");
//         }
//         res.status(200).json({ message: "Book updated successfully" });
//     });
// });


app.delete("/api/books/:isbn", (req, res) => {
    const { isbn } = req.params;
    const sql = "DELETE FROM books WHERE isbn = ?";
    db.query(sql, [isbn], (error) => {
        if (error) {
            console.error("Error deleting book:", error);
            return res.status(500).send("Failed to delete book.");
        }
        res.status(204).send();
    });
});

app.get("/api/books/search", (req, res) => {
    const { title, author, genre, isbn, publisher} = req.query;
    
    // Log the query parameters for debugging
    console.log("Received search parameters:", req.query);
    
    // Start with a JOIN between books and publisher tables
    let sql = `
        SELECT 
            books.*,
            publisher.name as publisher_name,
            publisher.pub_year
        FROM books
        JOIN publisher ON books.pub_id = publisher.pub_id
        WHERE 1=1`;
    
    const queryParams = [];

    if (title) {
        sql += " AND books.title LIKE ?";
        queryParams.push(`%${title}%`);
    }
    if (author) {
        sql += " AND books.author LIKE ?";
        queryParams.push(`%${author}%`);
    }
    if (genre) {
        sql += " AND books.genre LIKE ?";
        queryParams.push(`%${genre}%`);
    }
    if (isbn) {
        sql += " AND books.isbn LIKE ?";
        queryParams.push(`%${isbn}%`);
    }
    if (publisher) {
        sql += " AND publisher.name LIKE ?";
        queryParams.push(`%${publisher}%`);
    }
    
    // Log the SQL query and parameters to verify correctness
    console.log("Executing SQL:", sql, queryParams);
    
    db.query(sql, queryParams, (error, results) => {
        if (error) {
            console.error("Error searching books:", error);
            return res.status(500).send("Failed to search books.");
        }
        res.json(results);
    });
});

// API to add book to cart
app.post('/api/cart', (req, res) => {
    const { userId, isbn } = req.body;  // Retrieve userId and isbn from the request body

    if (!userId) {
        return res.status(400).json({ error: "User ID is required." });  // Handle missing user ID
    }

    // Query to check the book's availability
    const checkAvailabilityQuery = `SELECT availability FROM books WHERE isbn = ?`;

    db.query(checkAvailabilityQuery, [isbn], (err, result) => {
        if (err) {
            console.error("Error checking book availability:", err);
            return res.status(500).json({ error: "Failed to check book availability." });
        }

        // Check if the book exists in the database
        if (!result || result.length === 0) {
            return res.status(404).json({ error: "Book not found in the inventory." });
        }

        const availability = result[0].availability;

        if (availability === 0) {
            return res.status(400).json({ error: "Book is unavailable for checkout." }); // Prevent adding unavailable book
        }

        // Proceed with adding the book to the cart if availability is greater than 0
        const query = `
            INSERT INTO cart (user_id, isbn, quantity) 
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE quantity = quantity + 1
        `;

        db.query(query, [userId, isbn], (err, result) => {
            if (err) {
                console.error("Error adding book to cart:", err);
                return res.status(500).json({ error: "Failed to add book to cart." });
            }

            res.status(200).json({ message: "Book added to cart successfully!" });
        });
    });
});


// Route to fetch cart items for the logged-in user
app.get('/api/cart', (req, res) => {
    const userId = req.session.userId;  // Retrieve user ID from session

    if (!userId) {
        return res.status(401).json({ error: "User is not logged in." });
    }

    const query = `
        SELECT books.isbn, books.title, books.author, books.genre, cart.quantity 
        FROM cart
        JOIN books ON cart.isbn = books.isbn
        WHERE cart.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching cart items:", err);
            return res.status(500).json({ error: "Failed to fetch cart items." });
        }

        res.status(200).json(results);  // Send back the cart items as a JSON response
    });
});

// remove books from cart
app.delete("/api/cart/:isbn", (req, res) => {
    const { isbn } = req.params;
    const sql = "DELETE FROM cart WHERE isbn = ?";
    db.query(sql, [isbn], (error) => {
        if (error) {
            console.error("Error removing book:", error);
            return res.status(500).send("Failed to remove book.");
        }
        res.status(204).send();
    });
});

// update availability after checkout
app.put("/api/cart/checkout/:isbn", (req, res) => {
    const { isbn } = req.params;
    // const { availability } = req.body;
    const query = `
        Update books
        Set availability = availability - 1
        WHERE isbn = ?
    `;

    db.query(query, [isbn], (error) => {
        if (error) {
            console.error("Error updataing availability:", error);
            return res.status(500).send("Failed to update availability.");
        }
        res.status(204).send();
    });
})



// Set app port
app.listen(4500, () => {
    console.log("Server running on port 4500");
});
