
const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {

    // Makes initial connection, accepts callback 
    connectToDb: (cb) => {

        // ASYNC Accepts connection string
        MongoClient.connect('mongodb://localhost:27017/tutorial_bookstore')
        .then((client) => {
            dbConnection = client.db();
            return cb;
        })
        .catch(err => {
            console.log(err);
            return cb(err);
        })
    },

    // Returns connection object to database
    getDb: () => dbConnection
}












