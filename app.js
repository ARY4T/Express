require('dotenv').config();

const express = require('express');

const fs = require('fs');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const { doubleCsrf } = require('csrf-csrf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const {v2:cloudinary} = require('cloudinary');
const {CloudinaryStorage} = require('multer-storage-cloudinary')

const path = require('path');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDbStore({
    uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tvddmzo.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?appName=Cluster0`,
    collection: 'sessions'
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    getSessionIdentifier: (req) => req.session.id,
    cookieName: '__csrf',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    },
    size: 64,
    getCsrfTokenFromRequest: (req) => {
        // Check body field first (form submissions), then header (fetch/AJAX)
        return req.body._csrf || req.headers['x-csrf-token'];
    }
});



app.set('view engine', 'ejs');
app.set('views', 'views');

const fileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: store }));

// cookie-parser must come BEFORE csrf-csrf middleware
app.use(cookieParser());
app.use(doubleCsrfProtection);
app.use(flash());


//res.locals is provided by express js
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = generateCsrfToken(req, res);
    next();
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            // if we throw error inside of thenn, catch or callbacks, throw error wont reach the error handling middleware
            // throw new Error(err);
            next(new Error(err));
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.error('SERVER ERROR:', error);
    res.status(500).render('500',
        {
            pageTitle: "Error!",
            path: '/500',
            isAuthenticated: req.session?.isLoggedIn
        }
    );
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tvddmzo.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?appName=Cluster0`)
    .then((result) => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });