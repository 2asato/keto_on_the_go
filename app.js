var express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    mongooseCurrency = require('mongoose-currency').loadType(mongoose),
    Location = require('./models/location')
    seedDB = require('./seeds');



// connect mongoose
mongoose.connect('mongodb://localhost/seattle_on_keto', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// run seedDB
seedDB();
    

// landing page
app.get('/', function(req, res) {
    res.render('landing')
})

// locations index route
app.get('/locations', function(req, res) {
    Location.find({}, function(err, allLocations) {
        if(err) {
            console.log(err);
            
        } else {
            res.render('locations/index', { locations:allLocations });

        }
    })
})

// locations create route
app.post('/locations', function(req, res) {
    Location.create(req.body.location, function(err, newLocation) {
        if(err) {
            console.log(err);
            res.render('locations/new')
        } else {
            newLocation.save();
            console.log(newLocation);
            res.redirect('locations')
        }
    })
})

// locations new route
app.get('/locations/new', function(req, res) {
    res.render('locations/new')
})

// location show route
app.get('/locations/:id', function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if(err) {
            console.log(err);
            res.redirect('back')
        } else {
            console.log(foundLocation);
            res.render('locations/show', { location: foundLocation })
        }
    })
})

// Tell Express to listen for requests (start server)
app.listen(8000, function(){
    console.log('Out On Keto server has started on port 8000');
})