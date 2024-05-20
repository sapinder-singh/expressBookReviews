const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise resolved")
    }, 3000)
})

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Username or password not provided" });
    }

    let user = users.find((user) => user.username === username)
    if (user) {
        res.status(300).json({ message: "User exists already." })
    } else {
        users.push({ username, password })
        res.status(200).json({ message: "User created successfully." })
    }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    return await myPromise.then(() => res.status(200).json(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const result = books.find((book) => book.isbn == req.params?.isbn)

    return await myPromise.then(() => result ? res.status(200).json(result) : res.status(404).json({ message: "Not found" }));
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const result = books.find((book) => book.author.toLowerCase() == req.params?.author.toLowerCase())

    return await myPromise.then(() => result ? res.status(200).json(result) : res.status(404).json({ message: "Not found" }));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const result = books.find((book) => book.title.toLowerCase() == req.params?.title.toLowerCase())

    return await myPromise.then(() => result ? res.status(200).json(result) : res.status(404).json({ message: "Not found" }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const result = books.find((book) => book.isbn == req.params?.isbn)

    return result ? res.status(200).json(result.reviews) : res.status(404).json({ message: "Not found" });
});

module.exports.general = public_users;
