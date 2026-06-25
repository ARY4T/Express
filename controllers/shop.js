const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list',
                {
                    prods: products,
                    pageTitle: 'All Products',
                    path: '/products',
                });
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then((product) => {
            res.render('shop/product-detail',
                {
                    product: product,
                    pageTitle: product.title,
                    path: '/products'
                });
        })
        .catch(err => console.log(err));

}

exports.getIndex = (req, res, next) => {

    Product.fetchAll()
        .then(products => {
            res.render('shop/index',
                {
                    prods: products,
                    pageTitle: 'Shop',
                    path: '/',
                });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products,
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
            // returns an array holding that product
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }


            if (product) {
                //cartItem is the extra field added by sequelize to give us access to the inbetween table for this exact product
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;

                return product
            }

            return Product.findByPk(prodId);

        })
        .then(product => {
            //additional info that should be set in the in bw table
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
            //addproduct method is provided by sequelize for many to many relationships
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

};

exports.postOrder = (req, res, next) => {
    let fetchedCart;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts()
        })
        //products is an array containing the products

        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    //modifying each item in products so that we can map the quantity of each product with it
                    return order.addProducts(products.map((product) => {
                        //name orderItem is same as the name of model created in sql
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result =>{
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    //getOrders is a helper method added by sequelize because of our association

    //we will use eager loading to fetch all the products along with all the orders usinf the include

    //products is the pularised name of product model, sequelized pluralised it
    //this works because we have relation bw product and orders
    req.user.getOrders({include: ['products']})
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders,
        });
    })
    .catch(err => console.log(err));

    
}
