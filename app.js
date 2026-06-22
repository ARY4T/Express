const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { kMaxLength } = require('buffer');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user; // storing sequlize object user from the database in the req
            // so when we call req.user later we can also excute the sequelize functions

            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


//associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// cascade will cause ripple effect and delete all the things created by the user like some product

User.hasMany(Product);

//only one of the below will work
//this will add a key to cart, which the user id to which that cart belongs
User.hasOne(Cart);
Cart.belongsTo(User);

//need an intermediate table to set this us
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


sequelize
    // .sync({force : true})
    .sync()
    .then(result => {
        // console.log(result);
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email: 'test@test.com' });
        }

        return user;
    })
    .then(user => {
        // console.log(user);
        return user.createCart();

    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

