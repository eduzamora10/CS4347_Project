import mysql from 'mysql2';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Database connection setup
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'soccer',
    database: '4347_db'
});

connection.connect((error) => {
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

// Handle login POST request
app.post("/", (req, res) => {
    const { id, password, userType } = req.body;
    const query = "SELECT * FROM authentification_system WHERE username = ? AND password = ? AND user_type = ?";

    connection.query(query, [id, password, userType], (error, results) => {
        if (error) {
            console.error("Login query error:", error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            res.redirect("/home");
        } else {
            res.redirect("/?error=invalid_credentials");  // Optionally include error query
        }
    });
});

// Book API routes
app.get("/api/books", (req, res) => {
    const sql = "SELECT * FROM books";
    connection.query(sql, (error, results) => {
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
    
    connection.query(sql, [isbn, title, author, availability, genre, pub_id, staff_id], (error, result) => {
        if (error) {
            console.error("Error adding book:", error);
            return res.status(500).send("Failed to add book.");
        }
        res.status(201).json({ id: result.insertId, isbn, title, author, availability, genre, pub_id, staff_id });
    });
});


app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    const sql = "UPDATE books SET title = ?, author = ? WHERE isbn = ?";
    connection.query(sql, [title, author, id], (error) => {
        if (error) {
            console.error("Error updating book:", error);
            return res.status(500).send("Failed to update book.");
        }
        res.send("Book updated successfully.");
    });
});

app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM books WHERE isbn = ?";
    connection.query(sql, [id], (error) => {
        if (error) {
            console.error("Error deleting book:", error);
            return res.status(500).send("Failed to delete book.");
        }
        res.status(204).send();
    });
});

// Set app port
app.listen(4500, () => {
    console.log("Server running on port 4500");
});
