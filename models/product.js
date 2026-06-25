const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    save(){
        const db = getDb();
        // just as db if it doesnt exist yet, it will be created the first time we insert data
        // db -> collections -> documents
        return db.collection('products')
        .insertOne(this)
        .then(result => {
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
        return db.collection('products').find({_id: prodId})
        .next()
        .then(product =>{
            console.log(product);
            return product;
        })
        .catch(err => {
            console.log(err);
        })
    }
}


module.exports = Product;