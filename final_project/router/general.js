const express = require('express');
let books = require("../router/booksdb.js"); // Ensure correct path
const public_users = express.Router();

// Task 10: Get the list of books using async/await
public_users.get('/books', async (req, res) => {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 10: Alternative using Promises
public_users.get('/books-promise', (req, res) => {
    Promise.resolve(books)
        .then(bookList => res.status(200).json(bookList))
        .catch(() => res.status(500).json({ message: "Error fetching books" }));
});

// Task 11: Get book details by ISBN using async/await
public_users.get('/books/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

// Task 11: Alternative using Promises
public_users.get('/books-promise/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    Promise.resolve(books[isbn])
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.status(200).json(book);
        })
        .catch(() => res.status(500).json({ message: "Error fetching book by ISBN" }));
});

// Task 12: Get book details by author using async/await
public_users.get('/books/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

        if (!booksByAuthor.length) {
            return res.status(404).json({ message: "No books found by this author" });
        }

        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 12: Alternative using Promises
public_users.get('/books-promise/author/:author', (req, res) => {
    const { author } = req.params;
    Promise.resolve(Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase()))
        .then(bookList => {
            if (!bookList.length) {
                return res.status(404).json({ message: "No books found by this author" });
            }
            res.status(200).json(bookList);
        })
        .catch(() => res.status(500).json({ message: "Error fetching books by author" }));
});

// Task 13: Get book details by title using async/await
public_users.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

        if (!booksByTitle.length) {
            return res.status(404).json({ message: "No books found with this title" });
        }

        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// Task 13: Alternative using Promises
public_users.get('/books-promise/title/:title', (req, res) => {
    const { title } = req.params;
    Promise.resolve(Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase()))
        .then(bookList => {
            if (!bookList.length) {
                return res.status(404).json({ message: "No books found with this title" });
            }
            res.status(200).json(bookList);
        })
        .catch(() => res.status(500).json({ message: "Error fetching books by title" }));
});

module.exports = public_users;
