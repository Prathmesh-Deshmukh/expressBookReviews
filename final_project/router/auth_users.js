const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("../router/booksdb.js"); // Ensure correct path
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "secret_key"; // Change this to a more secure key in production

// Function to check if a username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to authenticate user
const authenticatedUser = async (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Task 7: User login
regd_users.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!(await authenticatedUser(username, password))) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    // Store token in session
    req.session.authorization = { token, username };

    return res.status(200).json({ message: "Login successful", token });
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    if (!req.session || !req.session.authorization) {
        return res.status(401).json({ message: "Unauthorized: No session found" });
    }

    const token = req.session.authorization.token;
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.username = decoded.username;
        next();
    });
};

// Task 8: Add or modify book review
regd_users.put("/auth/review/:isbn", authenticate, async (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", authenticate, async (req, res) => {
    const { isbn } = req.params;
    const username = req.username;

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found to delete" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports = regd_users; // Export the router
module.exports.isValid = isValid;
module.exports.users = users;
