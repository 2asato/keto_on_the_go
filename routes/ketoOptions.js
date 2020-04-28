var express = require('express'),
    router = express.Router(),
    KetoOptions = require('../models/ketoOptions'),
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


module.exports = router;