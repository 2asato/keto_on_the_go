var express = require('express'),
    router = express.Router({mergeParams: true}),
    Image = require('../models/image')
    Location = require('../models/location'),
    middleware = require('../middleware')


// new image route
router.get('/locations/:id/images/new', function(req, res) {
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
            
        } else {
            res.render('images/new', { location: location})
        }
    })
})

// create image route
router.post('/locations/:id/images', middleware.isSignedIn, function(req, res) {
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
            
        } else {
            Image.create(req.body.image, function(err, image) {
                if (err) {
                    console.log(err);
                    
                } else {
                    console.log(image.url);
                    
                    image.user.id = req.user._id;
                    image.user.username = req.user.username;
                    image.save();
                    location.images.push(image);
                    location.save();
                    console.log(location.images);
                    
                    console.log(location.images[0].url);
                    
                    res.redirect('/locations/' + location._id);
                }
            })
        }
    })
})


module.exports = router;