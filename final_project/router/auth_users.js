const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; 

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username exists and the password matches
  if (users[username] && users[username] === password) {
    // Generate a JWT token for authentication
    const token = jwt.sign({ username }, "your-secret-key");
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ error: "Invalid username or password" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if the book with the provided ISBN exists
  if (books[isbn]) {
    // Add the review to the book
    books[isbn].reviews.push(review);
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
