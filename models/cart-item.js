const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true,
    },
    quantity : Sequelize.INTEGER

    // id of cart doesnt have to be added by us because we will handle that automatically with Sequelize
    // thru association

});

module.exports = CartItem;