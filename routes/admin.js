const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


// /admin/add-product
router.get('/add-product', adminController.getAddProducts);

// /admin/products
router.get('/products', adminController.getProducts);

// /admin/add-product
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProducts);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;