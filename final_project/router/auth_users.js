const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();

// Sample users data 
let users = {
  "soroosh_aghaei": "12345678"
};

const isValid = (username) => {
  return users.hasOwnProperty(username);
};

const authenticatedUser = (username, password) => {
  return users.hasOwnProperty(username) && users[username] === password;
};

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username exists and the password matches
  if (authenticatedUser(username, password)) {
    // Store username in the session
    req.session.username = username;

    // Generate a JWT token for authentication
    const token = jwt.sign({ username }, "your-secret-key");
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ error: "Invalid username or password" });
  }
});


// Add or modify a book review route
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Retrieve username from the JWT token in the session
  const username = req.session.username;

  // Check if the book with the provided ISBN exists
  if (books[isbn]) {
    // Check if the user already has a review for this book
    const existingReviewIndex = books[isbn].reviews.findIndex(
      (r) => r.username === username
    );

    if (existingReviewIndex !== -1) {
      // Modify the existing review
      books[isbn].reviews[existingReviewIndex].review = review;
    } else {
      // Add a new review
      books[isbn].reviews.push({ username, review });
    }

    return res
      .status(200)
      .json({ message: "Review added or modified successfully" });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Delete a book review route
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Retrieve username from the JWT token in the session
  const username = req.session.username;

  // Check if the book with the provided ISBN exists
  if (books[isbn]) {
    // Filter out the reviews for the current user
    books[isbn].reviews = books[isbn].reviews.filter(
      (r) => r.username !== username
    );

    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
