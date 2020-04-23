var express = require('express'),
    router = express.Router(),
    Location = require('../models/location');

// ======================
// locations routes
// =======================

// locations index route
router.get('/locations', function(req, res) {
    Location.find({}, function(err, allLocations) {
        if(err) {
            console.log(err);
            
        } else {
            res.render('locations/index', { locations: allLocations, currentUser: req.user });

        }
    })
})

// locations create route
router.post('/locations', isSignedIn, function(req, res) {
    Location.create(req.body.location, function(err, newLocation) {
        if(err) {
            console.log(err);
            res.render('locations/new')
        } else {
            // add username and id to post
            newLocation.author.username = req.user.username;
            newLocation.author.id = req.user._id;            
            newLocation.save();
            console.log(newLocation);
            res.redirect('locations')
        }
    })
})

// locations new route
router.get('/locations/new', isSignedIn, function(req, res) {
    res.render('locations/new')
})

// location show route
router.get('/locations/:id', function(req, res) {
    Location.findById(req.params.id).populate('comments').exec(function(err, foundLocation) {
        if(err) {
            console.log(err);
            res.redirect('back')
        } else {
            console.log(foundLocation);
            res.render('locations/show', { location: foundLocation })
        }
    })
})

// location edit route
router.get('/locations/:id/edit', checkLocationOwnership, function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        res.render('locations/edit', { location: foundLocation })
    })
})

// location update route
router.put('/locations/:id', checkLocationOwnership, function(req, res) {
    // find and update correct location
    Location.findByIdAndUpdate(req.params.id, req.body.location, function(err, updatedLocation) {
        if(err) {
            res.redirect('/locations');
        } else {
            res.redirect('/locations/' + req.params.id)
        }
    })
})

// location delete route
router.delete('/locations/:id', checkLocationOwnership, function(req, res) {
    // find and delete correct location
    Location.findByIdAndRemove(req.params.id, function(err, ) {
        if(err) {
            res.redirect('/loations')
        } else {
            res.redirect('/locations')
        }
    })
})

// middleware

// checks if user is signed in
function isSignedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/signin');
}

// checks for user/location association
function checkLocationOwnership(req, res, next){
    if(req.isAuthenticated()){        
        Location.findById(req.params.id, function(err, foundLocation){
            // checks for error and foundCampground with exact parameters
            if(err || !foundLocation){
                res.redirect('back')
            } else {
                // does user own location
                if(foundLocation.author.id.equals(req.user._id)){
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