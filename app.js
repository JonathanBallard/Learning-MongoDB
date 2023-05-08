
const express = require('express');
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

    // pass name of collection to collection() method
    db.collection('books')
        .find() // returns a Cursor Object
                // Cursor: Object that points to set of documents outlined by query

    res.json(
        {message: "welcome to the api"}
    );
})





