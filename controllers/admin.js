const Product = require('../models/product');

exports.getAddProducts = (req, res, next)=>{
    res.render('admin/edit-product', 
        {pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        editing: false,
    });
}

exports.postAddProduct = (req, res, next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        // mongoose will automatically store the if we write just this
        userId: req.session.user
    });

    product.save()
    //technincally this mongoose save method doesnt give us a promise but we can still use then and catch on it
    .then(result => {
        // console.log(result);
        console.log('Created product')
        res.redirect('/admin/products')
    })
    .catch(err => {
    console.log(err);
    });
    
};

exports.getEditProducts = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(product=>{
        if(!product) return res.redirect('/');
        res.render('admin/edit-product', 
        {pageTitle: 'Edit Product', 
        path: '/admin/edit-product', 
        editing: editMode,
        product: product, 
        });
    })
    .catch(err => console.log(err));
    
}

exports.postEditProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    
    Product.findById(prodId).then(product => {
        //product is a mongoose object, so we can use mongoose methods on it
        if(product.userId.toString() !== req.user._id.toString()){
            return res.rediret('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;

        return product.save().then(result=>{
        console.log("Updated Product");
        res.redirect('/admin/products');
    })
    })
    
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next)=>{
    Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then((products)=>
        {   
            console.log(products);
            res.render('admin/products', 
            {prods:products, 
            pageTitle:'adminProducts',
            path:'/admin/products', 
            }); 
        })
    .catch(err => console.log(err));
     
};

exports.postDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;

    Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() =>{
        console.log("DESTROYED PRODUCT");
        res.redirect('/admin/products');
    })
    .catch(err =>{
        console.log(err);
    });

}