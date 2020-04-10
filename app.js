require('dotenv').config();

var express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Location = require('./models/location'),
    Comment = require('./models/comment'),
    User = require('./models/user')
    seedDB = require('./seeds');

// connect mongoose
mongoose.connect('mongodb://localhost/seattle_on_keto', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// passport configuration
app.use(require('express-session')({
    secret: 'You dont know my name',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// run seedDB
seedDB();
    

// landing page
app.get('/', function(req, res) {
    res.render('landing')
})


// ======================
// locations routes
// =======================

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
app.get('/locations/:id/edit', function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        res.send('soon to be location edit page')
    })
})



// ===================
// comments routes
// ====================

// new comment page
app.get('/locations/:id/comments/new', function(req, res) {
    // find location by id
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            
        } else {
            res.render('comments/new', { location: location })
        }
    })
})

app.post('/locations/:id/comments', function(req, res) {
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
                    location.comments.push(comment);
                    location.save();                  
                    res.redirect('/locations/' + location._id);
                }
            })
        }
    })
})





// Tell Express to listen for requests (start server)
app.listen(8000, function(){
    console.log('Out On Keto server has started on port 8000');
})