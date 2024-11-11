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

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'soccer',
    database: '4347_db'
});

// Connect to the database
connection.connect((error) => {
    if (error) throw error;
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
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            res.redirect("/home");  // Redirect to home if login is successful
        } else {
            res.redirect("/");  // Redirect back to login page if credentials are incorrect
        }
    });
});

// Get all books
app.get("/api/books", (req, res) => {
    const sql = "SELECT * FROM books";
    connection.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Failed to retrieve books.");
        }
        res.json(results);
    });
});

// Create a new book
app.post("/api/books", (req, res) => {
    const { title, author } = req.body;
    const sql = "INSERT INTO books (title, author) VALUES (?, ?)";
    connection.query(sql, [title, author], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Failed to add book.");
        }
        res.status(201).json({ id: result.insertId, title, author });
    });
});

// Update a book
app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    const sql = "UPDATE books SET title = ?, author = ? WHERE id = ?";
    connection.query(sql, [title, author, id], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Failed to update book.");
        }
        res.send("Book updated successfully.");
    });
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM books WHERE id = ?";
    connection.query(sql, [id], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Failed to delete book.");
        }
        res.status(204).send();  // Send no content response on successful delete
    });
});

// Set app port
app.listen(4500, () => {
    console.log("Server running on port 4500");
});
