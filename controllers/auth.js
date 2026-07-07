const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    }); 
};

exports.postLogin = (req, res, next) => {
    
    User.findById('6a499f9d6554081365933860')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = { _id: user._id.toString(), name: user.name, email: user.email };
        req.session.save(err => {
            if(err) console.log(err);
            res.redirect('/'); 
        });
    })
    .catch(err => console.log(err));
       
};

exports.postLogout = (req, res, next) => {
    
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    });
       
};