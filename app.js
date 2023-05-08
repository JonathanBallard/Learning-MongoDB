
const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db')

// init app and middleware
const app = express();

let db;

// DB connection
connectToDb((err) => {

    if(!err){
        app.listen(3000, () => {
            console.log("App listening on port: 3000")
        });
        db = getDb();
    }
});



//routes

//handles 'get' requests
app.get('/books', (req, res) => {
    let books = [];

    // pass name of collection to collection() method
    db.collection('books')
        .find() // returns a Cursor object
                // Cursor: Object that points to set of documents outlined by Query
                // Exposes methods for collection: toArray() & forEach()
        .sort({ author: 1 }) // Sorts alphabetically by author name
                             // Also returns a Cursor object
        .forEach(book => { // I set this to return book so that I could console log results as well under the .then() method
            books.push(book)
            return book
        }) // ASYNC method
        .then((book) => { 
            res.status(200).json(books) // Status: 200 == OK
            console.log("Successfully added: " + book)
        })
        .catch(() => {
            res.status(500).json({ error: "Could not fetch the documents. Error occured at: " +  books.length() }) // Status: 500 == Server Error
            console.log(err)
        })
})

app.get('/books/:bookId', (req, res) => {
    db.collection('books').findOne({ _id: ObjectId(req.params.bookId)})
    .then(doc => {
        res.status(200).json(doc) // Status: 200 == OK
    })
    .catch(err => {
        res.status(500).json({error: 'Could not fetch the document'})
    })
})



