var express = require('express'),
    router = express.Router({mergeParams: true}),
    Comment = require('../models/comment'),
    Location = require('../models/location'),
    middleware = require('../middleware')


// ===================
// comments routes
// ====================

// new comment page
router.get('/locations/:id/comments/new', middleware.isSignedIn, function(req, res) {
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
router.post('/locations/:id/comments', middleware.isSignedIn, function(req, res) {
    // lookup location using id
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            res.redirect('/locations')
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash('error', 'Something went wrong?')
                    console.log(err);
                    
                } else {
                    // console.log(req.user._id);
                    
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // add new comment to location
                    location.comments.push(comment);
                    // save location with new comment
                    location.save();  
                    req.flash('success', 'Comment added successfully')                
                    res.redirect('/locations/' + location._id);
                }
            })
        }
    })
})

// edit comments route
router.get('/locations/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if (err || !foundLocation) {
            req.flash('error', 'Location not found')
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                
                res.redirect('back')
            } else {
                res.render('comments/edit', { location_id: req.params.id, comment: foundComment});
            }
        })
    })
})

// update comments route
router.put('/locations/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment edited successfully')
            res.redirect('/locations/' + req.params.id)
        }
    })
})

// delete comments route
router.delete('/locations/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted successfully')
            res.redirect('/locations/' + req.params.id);
        }
    })
})





module.exports = router;
