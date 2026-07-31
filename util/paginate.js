const Product = require('../models/product');

const ITEMS_PER_PAGE = 12;

const getPaginatedProducts = (page, filter = {}) => {
    let totalItems;

    return Product.find(filter).countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find(filter)
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            return {
                products,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            };
        });
};

module.exports = { getPaginatedProducts, ITEMS_PER_PAGE };
