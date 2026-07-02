const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, id, userId){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        // if we dont assign it a value then it will be generated automatically
        this._id = id ? new mongodb.ObjectId(id): null;
        this.userId = userId;
    }
    save(){
        const db = getDb();
        // just as db if it doesnt exist yet, it will be created the first time we insert data
        // db -> collections -> documents
        let dbOp;

        // $set is a specially property understood by mongodb which takes an object as a value
        // we can also use $set : {title: this.title, so on}
        // _id will not be overwritten

        if(this._id){
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
        }
        else{
            dbOp = db.collection('products').insertOne(this);
        }
        
        return dbOp.then(result => {
            console.log(result);
            return result;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    }

    static fetchAll(){
        const db = getDb();
        // find doesnt return a promise but a cursor
        // cursor is an object provided by mongo db

        //toArray converts all documents in a javascript object
        // toArray method only good if we are dealing with a few hundred documents
        return db.collection('products').find().toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(prodId){
        const db = getDb();
        //find will return a cursor
        return db.collection('products').find({_id: new mongodb.ObjectId(prodId)})
        .next()
        .then(product =>{
            console.log(product);
            return product;
        })
        .catch(err => {
            console.log(err);
        })
    }

    static deleteById(prodId){
        const db = getDb();
        // prodId is a string argument which needs to be converted to mongodb ObjectId type
        return db.collection('products').deleteOne({_id : new mongodb.ObjectId(prodId)})
        .then(result =>{
            console.log('Deleted');
        })
        .catch(err => {
            console.log(err);
        });
    }
}


module.exports = Product;