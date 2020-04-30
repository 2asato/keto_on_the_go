var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    flash = require('connect-flash')


// ================
// auth routes
// ==================

// signup form route
router.get('/signup', function(req, res) {
    res.render('signup')
})

// handle signup logic
router.post('/signup', function(req, res) {
    var newUser = new User(
        { 
            username: req.body.username,
            email: req.body.email 
        }
    );
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render('signup')
        } 
            passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome to YelpCamp ' + user.username)
            res.redirect('/locations');
        })
    })
})

// signin form route
router.get('/signin', function(req, res) {
    res.render('signin')
})

// handle signin logic
router.post('/signin', passport.authenticate('local', 
    { 
        successRedirect: '/locations', 
        failureRedirect: '/signin'
    }), function(req, res) {

})

// signout route
router.get('/signout', function(req, res) {
    req.logOut();
    res.redirect('/locations');
})


// middleware
function isSignedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Sign In First!');
    res.redirect('/signin');
}


module.exports = router;