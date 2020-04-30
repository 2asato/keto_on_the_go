var Location = require('../models/location'),
    Comment = require('../models/comment'),
    KetoOption = require('../models/ketoOption'),
    middlewareObj = {};


// =============
// MIDDLEWARE
// =============

// checks if user is signed in
middlewareObj.isSignedIn =
function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be signed in to do that!');
    res.redirect('/signin')
}

// checks for user/location association
middlewareObj.checkLocationOwnership =
function checkLocationOwnership(req, res, next){
    if(req.isAuthenticated()){        
        Location.findById(req.params.id, function(err, foundLocation){
            // checks for error and foundCampground with exact parameters
            if(err || !foundLocation){
                req.flash('error', 'Location not found')
                res.redirect('back')
            } else {
                // does user own location
                if(foundLocation.author.id.equals(req.user._id)){
                    next();

                } else {
                    req.flash('error', 'You do not have permission to do that!')
                    res.redirect('back');
                }
            }
        });
            // if not redirect
    } else {
        req.flash('error', 'You need to be signed in to do that!')
        res.redirect('back');       
    }
}


// checks if user/comment are associated
middlewareObj.checkCommentOwnership =
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){        
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash('error', 'Comment not found')
                res.redirect('back')
            } else {
                // does user own campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();

                } else {
                    req.flash('error', 'You do not have permission to do that!' )
                    res.redirect('back');
                }
            }
        });
            // if not redirect
    } else {
        req.flash('error', 'You need to be signed in to do that!')
        res.redirect('back');
        
    }

}

module.exports = middlewareObj;
