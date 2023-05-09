
const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db')

// init app and middleware
const app = express()

let db

// DB connection
connectToDb((err) => {

    if(!err){
        app.listen(3000, () => {
            console.log("App listening on port: 3000")
        })
        db = getDb()
    }
    else {
        console.log("Failed to connect to DB: " + err)
    }
})



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
        }) // 'forEach()' is an ASYNC method. Therefore the 'then()' method will return upon successful completion
        .then(() => { 
            res.status(200).json(books) // Status: 200 == OK
        })
        .catch(() => {
            res.status(500).json({ error: "Could not fetch the documents "}) // Status: 500 == Server Error
        })
})

app.get('/', (req, res) => {
    res.json({ msg: "root route"})
})

app.get('/books/:bookId', (req, res) => {

    // This only check if the bookId is of the correct length. Passing a bookId with 1 character changed will still return null
    if(ObjectId.isValid(req.params.bookId)){

        db.collection('books')

        // ObjectId strings must be 12 bytes or 24 HEX characters long
        .findOne({ _id: new ObjectId(req.params.bookId)})
        .then(doc => {
            if(doc !== null){
                res.status(200).json(doc)
            }
            else {
                res.status(500).json({ error: "There is no book with the ObjectId of: [ '" + req.params.bookId + "' ]"})
            }
        })
        .catch(err => {
            res.status(500).json({error: 'Could not fetch the document'})
        })
    }
    else{
        res.status(500).json({ error: "ObjectId of bookId: [ '" + req.params.bookId + "' ], is not valid"})
    }
})










