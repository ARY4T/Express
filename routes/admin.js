const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProducts);

// // /admin/products
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;