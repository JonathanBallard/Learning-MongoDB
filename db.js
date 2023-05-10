
const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {

    // Makes initial connection, accepts callback 
    connectToDb: (cb) => {

        console.log("before MongoClient connect")
        
        // ASYNC Accepts connection string
        // ? Why Didn't it accept "localhost:27017" in connection string ?
        MongoClient.connect("mongodb://127.0.0.1:27017/tutorial_bookstore") 
        .then((client) => {
            dbConnection = client.db()
            console.log("after db connection")
            return cb()
        })
        .catch(err => {
            console.log("after err")
            console.log(err)
            return cb(err)
        })
    },

    // Returns connection object to database
    getDb: () => dbConnection
}












