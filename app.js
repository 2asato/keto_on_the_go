require('dotenv').config();

var express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    Location = require('./models/location'),
    Comment = require('./models/comment'),
    User = require('./models/user')
    seedDB = require('./seeds');

// connect mongoose
mongoose.connect('mongodb://localhost/seattle_on_keto', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

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

// use currentUser on all pages
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

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
        res.render('locations/edit', { location: foundLocation })
    })
})

// location update route
app.put('/locations/:id', function(req, res) {
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
app.delete('/locations/:id', function(req, res) {
    // find and delete correct location
    Location.findByIdAndRemove(req.params.id, function(err, ) {
        if(err) {
            res.redirect('/loations')
        } else {
            res.redirect('/locations')
        }
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


// ================
// auth routes
// ==================

// signup form route
app.get('/signup', function(req, res) {
    res.render('signup')
})

// handle signup logic
app.post('/signup', function(req, res) {
    var newUser = new User(
        { 
            username: req.body.username,
            email: req.body.email 
        }
    );
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render('signup')
        } 
            passport.authenticate('local')(req, res, function() {
            res.redirect('/locations');
        })
    })
})





// Tell Express to listen for requests (start server)
app.listen(8000, function(){
    console.log('Out On Keto server has started on port 8000');
})