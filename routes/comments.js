var express = require('express'),
    router = express.Router(),
    Comment = require('../models/comment'),
    Location = require('../models/location')


// ===================
// comments routes
// ====================

// new comment page
router.get('/locations/:id/comments/new', isSignedIn, function(req, res) {
    // find location by id
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            
        } else {
            res.render('comments/new', { location: location })
        }
    })
})

// create comments route
router.post('/locations/:id/comments', isSignedIn, function(req, res) {
    // lookup location using id
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            res.redirect('/locations')
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    
                } else {
                    location.comments.push(comment);
                    location.save();                  
                    res.redirect('/locations/' + location._id);
                }
            })
        }
    })
})


// middleware
function isSignedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/signin');
}


module.exports = router;
