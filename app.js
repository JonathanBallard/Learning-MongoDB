
const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db')


// ================================
// ========== MIDDLEWARE ==========
// ================================

// init app and middleware
const app = express()

// Passes any JSON coming from the request so that we can use it in the handler function (POST request)
app.use(express.json())



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



// ====================================================================
// ============================== ROUTES ==============================
// ====================================================================


// ===================================
// =============== GET ===============
// =================================== 

app.get('/', (req, res) => {
    res.json({ msg: "root route"})
})


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


// ====================================
// =============== POST ===============
// ====================================

app.post('/books', (req, res) => {

    // Requires middleware to retrieve any JSON data from the request. 
    // For Info: See Middleware section => app.use(express.json())

    // The book referenced here is the book document we are POSTing. NOT a book we are GETing
    const book = req.body
    let bookAssignedId
    let updatedReviewsObj = {reviews: []}
    let assignedBook

    // POSTs book
    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(200).json(result)
            
            // In this scenario, the book was successfully added, but the review objects all have a bookId that doesn't actually point to the value assigned by MongoDB
            // Perhaps this should be fixed by updating the review objects like so:

        
            // ====================================
            // HERE BEGINS MY TOMFOOLERY
            // ====================================
            
            
            // bookAssignedId = res.insertedId
            
            // db.collection('books').findOne({ _id: bookAssignedId}).forEach(() => {
            //     updatedReviewsObj.reviews.push({
            //         bookId: bookAssignedId
            //     })
            // })
            // .catch(err => {
            //     res.status(500).json({err: "Could not create updated review object"})
            // })


            // ====================================
            // HERE ENDS MY TOMFOOLERY
            // ====================================

        })
        .catch(err => {
            res.status(500).json({err: "Could not POST new document"})
        })

        
        // ====================================
        // HERE AGAIN BEGINS MY TOMFOOLERY
        // ====================================

        
        // db.collection('books')
        //     .updateOne({_id: bookAssignedId}, ({reviews: updatedReviewsObj}) => {
        //         // update the review objects
                

        //         return updatedReviewsObj
        //     })
        //     .catch(err =>{
        //         res.status.json({ error: "Failed to update book" })
        //     })


        // ====================================
        // HERE AGAIN ENDS MY TOMFOOLERY
        // ====================================
})


// ====================================
// ============== DELETE ==============
// ====================================

app.delete('/books/:id', (req, res) => {

    if( ObjectId.isValid(req.params.id)){

        db.collection('books')
        .deleteOne({ _id: new ObjectId(req.params.id)})
            .then(result => {
                if(result !== null && result.deletedCount > 0){
                    res.status(200).json(result)
                }
                else {
                    res.status(500).json({ error: "There is no book with the ObjectId of: [ '" + req.params.id + "' ]"})
                }
            })
            .catch(err => {
                res.status(500).json({error: 'Could not delete the document'})
            })
    }
    else{
        res.status(500).json({ error: "ObjectId of id: [ '" + req.params.id + "' ], is not valid"})
    }

})






// ====================================
// ========== PATCH / UPDATE ==========
// ====================================




























































