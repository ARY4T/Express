const express = require('express');

const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProducts);

// // /admin/products
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product
router.post('/add-product', 
    [
        body('title')
            .isString()
            .isLength({min : 3})
            .withMessage('Title must be at least 3 characters long.')
            .trim(),

        body('price')
            .isFloat()
            .withMessage('Please enter a valid price.'),

        body('description')
            .trim()
            .isLength({min : 5, max : 400})
            .withMessage('Description must be between 5 and 400 characters.'),
        
    ] 
    ,isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-product', 
    [
        body('title')
            .isString()
            .isLength({min : 3})
            .trim(),

        body('price').isFloat(),

        body('description')
            .isLength({min : 5, max : 400})
            .trim(),
        
    ] , isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;