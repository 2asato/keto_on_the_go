var express = require('express'),
    router = express.Router(),
    KetoOption = require('../models/ketoOptions'),
    Location = require('../models/location');


// ==================
// KETO-OPTIONS ROUTES
// ==================

router.get('/locations/:id/keto-options/new', function(req, res) {
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
            
        } else {
            res.render('ketoOptions/new', { location: location });
        }
    })
})


// ketoOptions create route
router.post('/locations/:id/keto-options', function(req, res) {
    // lookup location by id
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
            res.redirect('/locations')
        } else {
            KetoOption.create(req.body.ketoOption, function(err, ketoOption) {
                if (err) {
                    console.log(err);
                    
                } else {
                    ketoOption.save();
                    location.ketoOptions.push(ketoOption);
                    location.save();
                    res.redirect('/locations/' + location._id)
                }
            })
        }
    })
})

// ketoOptions edit route
router.get('/locations/:id/keto-options/:ketoOption_id/edit', function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if (err || !foundLocation) {
            return res.redirect('back');
        } 
        KetoOption.findById(req.params.ketoOption_id, function(err, foundKetoOption) {
            if (err) {
                res.redirect('back')
            } else {
                res.send('soon to be keto-option edit form')
            }
        })
    })
})


module.exports = router;