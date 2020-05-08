var express = require('express'),
    router = express.Router(),
    Location = require('../models/location'),
    middleware = require('../middleware')

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
router.post('/locations', middleware.isSignedIn, function(req, res) {
    Location.create(req.body.location, function(err, newLocation) {
        if(err) {
            console.log(err);
            res.render('locations/new')
        } else {
            // add username and id to post
            newLocation.author.username = req.user.username;
            newLocation.author.id = req.user._id;            
            newLocation.save();
            // console.log(newLocation);
            req.flash('success', 'Location created')
            res.redirect('locations')
        }
    })
})

// locations new route
router.get('/locations/new', middleware.isSignedIn, function(req, res) {
    res.render('locations/new')
})

// location show route
router.get('/locations/:id', function(req, res) {
    Location.findById(req.params.id).populate('comments').populate('ketoOptions').exec(function(err, foundLocation) {
        if(err || !foundLocation) {
            req.flash('error', 'Location not found')
            res.redirect('back')
        } else {
            // console.log(foundLocation);
            res.render('locations/show', { location: foundLocation })
        }
    })
})

// location edit route
router.get('/locations/:id/edit', middleware.checkLocationOwnership, function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if (err) {
            res.redirect('/locations')
        } else {
            res.render('locations/edit', { location: foundLocation })
        }
    })
})

// location update route
router.put('/locations/:id', middleware.checkLocationOwnership, function(req, res) {
    // find and update correct location
    Location.findByIdAndUpdate(req.params.id, req.body.location, function(err, updatedLocation) {
        if(err) {
            res.redirect('/locations');
        } else {
            req.flash('success', 'Location edited successfully')
            res.redirect('/locations/' + req.params.id)
        }
    })
})

// location delete route
router.delete('/locations/:id', middleware.checkLocationOwnership, function(req, res) {
    // find and delete correct location
    Location.findByIdAndRemove(req.params.id, function(err, ) {
        if(err) {
            res.redirect('/loations')
        } else {
            req.flash('success', 'Location deleted successfully')
            res.redirect('/locations')
        }
    })
})

// location like route
router.post('/locations/:id/like', middleware.isSignedIn, function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if (err) {
            console.log(err);
            res.redirect('/locations');
        } 
        var foundUserLike = foundLocation.likes.some(function(like) {
            return like.equals(req.user._id);
        });
        if (foundUserLike) {
            foundLocation.likes.pull(req.user._id)
        } else {
            foundLocation.likes.push(req.user);
        }
        foundLocation.save(function(err) {
            if (err) {
                console.log(err);
                return res.redirect('/locations');
            }
            return res.redirect('/locations/' + foundLocation._id);
        })
    })
})






module.exports = router;