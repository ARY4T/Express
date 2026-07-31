const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        // name of the model to which it is related
        ref: 'User',
        required: true
    }
});

// connects a schema to a name
module.exports = mongoose.model('Product', productSchema);