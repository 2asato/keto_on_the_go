var express = require('express'),
    router = express.Router({mergeParams: true}),
    Location = require('../models/location'),
    middleware = require('../middleware')


// new image route
router.get('/locations/:id/images/new', function(req, res) {
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
            
        } else {
            res.send('soon to be new image form page')
        }
    })
})


module.exports = router;