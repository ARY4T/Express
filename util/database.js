const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const keys = require('../keys');

// _ signifies that this variable will only be used internally in this file

let _db;

const mongoConnect = (callback) =>{
    MongoClient.connect(keys.MONGO_URI)
    .then(client => {
        console.log('Connected!');
        _db = client.db();

        callback(client);
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if(_db){
        return _db;
    }

    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;