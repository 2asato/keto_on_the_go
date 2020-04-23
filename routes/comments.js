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
                    console.log(comment);
                    
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // add new comment to campground
                    location.comments.push(comment);
                    // save location with new comment
                    location.save();                  
                    res.redirect('/locations/' + location._id);
                }
            })
        }
    })
})

// edit comments route
router.get('/locations/:id/comments/:comment_id/edit', function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if (err || !foundLocation) {
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, function(req, foundComment) {
            if (err) {
                res.redirect('back')
            } else {
                res.render('comments/edit', { location_id: req.params.id, comment: foundComment});
            }
        })
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
