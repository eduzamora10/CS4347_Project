import mysql from 'mysql2';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();

// Middleware to parse URL-encoded data (form submissions)
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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../start.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../home.html"));
});

// Serve the book management page
app.get("/book_mgmnt", (req, res) => {
    res.sendFile(path.join(__dirname, "../book_mgmnt.html"));
});

// Serve the checkout page
app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "../checkout.html"));
});

// Handle login POST request
app.post("/", (req, res) => {
    const { id, password, userType } = req.body; // Get form data (ID, Password, User Type)
    
    // Check credentials in the authentification_system table
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

// Set app port
app.listen(4500, () => {
    console.log("Server running on port 4500");
});
