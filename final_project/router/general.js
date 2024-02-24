const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Convert the books object to an array of values
  const bookList = Object.values(books);

  // Return the array of books as JSON
  return res.status(200).json({ books: bookList });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  const bookDetails = Object.values(books).find((book) => book.isbn === isbn);

  if (bookDetails) {
    return res.status(200).json({ book: bookDetails });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const formattedAuthor = author.replace(/\s/g, "_"); // Replace spaces with underscores
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.replace(/\s/g, "_") === formattedAuthor
  );
  return res.status(200).json({ books: booksByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const formatedTitle = title.replace(/\s/g, "_"); // Replace spaces with underscores
  const booksByTitle = Object.values(books).filter(
    (book) => book.title.replace(/\s/g, "_") === formatedTitle
  );
  return res.status(200).json({ books: booksByTitle });
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const bookReviews =
    Object.values(books).find((book) => book.isbn === isbn)?.reviews || [];
  return res.status(200).json({ reviews: bookReviews });
});

// Registration route
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Store the new user
  users[username] = password;

  return res.status(200).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
