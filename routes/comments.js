var express = require('express'),
    router = express.Router({mergeParams: true}),
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
router.get('/locations/:id/comments/:comment_id/edit', checkCommentOwnership, function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if (err || !foundLocation) {
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
router.put('/locations/:id/comments/:comment_id', checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/locations/' + req.params.id)
        }
    })
})

// delete comments route
router.delete('/locations/:id/comments/:comment_id', checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/locations/' + req.params.id);
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

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){        
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                res.redirect('back')
            } else {
                // does user own campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();

                } else {
                    res.redirect('back');
                }
            }
        });
            // if not redirect
    } else {
        res.redirect('back');
        
    }

}



module.exports = router;
