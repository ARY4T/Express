const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// _ signifies that this variable will only be used internally in this file

let _db;

const mongoConnect = (callback) =>{
    MongoClient.connect('mongodb+srv://aryathakur_db_user:Al97bfp2VeXXwtfx@cluster0.tvddmzo.mongodb.net/?appName=Cluster0')
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