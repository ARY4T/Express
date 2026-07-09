const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message,
    }); 
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then(user => {
        if(!user){
            //flashing means this data will be removed form the session once we use the data
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = { _id: user._id.toString(), name: user.name, email: user.email };
                return req.session.save(err => {
                    if(err) console.log(err);
                    res.redirect('/'); 
                });

            }
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login')
        })

    })
    .catch(err => console.log(err));
       
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
            req.flash('error', 'E-mail exists already, please pick a different one.');
            return res.redirect('/signup');
        }

        return bcrypt.hash(password, 12)
            .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []},
            });

            return user.save();
            })
            .then(result => {
                res.redirect('/login');
            })
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
    
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    });
       
};