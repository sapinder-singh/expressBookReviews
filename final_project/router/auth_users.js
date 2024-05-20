const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "sapinder", "password": "12345" }];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Username or password not provided." });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const result = books.find((book) => book.isbn == req.params?.isbn)

    if (result && req.query.review) {
        result.reviews[req.session.authorization.username] = req.query.review
        return res.status(200).json({ message: "Review added successfully", data: result.reviews })
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const result = books.find((book) => book.isbn == req.params?.isbn)

    if (result) {
        delete result.reviews[req.session.authorization.username]
        return res.status(200).json({ message: "Review deleted successfully", data: result })
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
