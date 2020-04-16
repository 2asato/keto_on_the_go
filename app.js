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

var locationRoutes = require('./routes/locations')

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




// ===================
// comments routes
// ====================

// new comment page
app.get('/locations/:id/comments/new', isSignedIn, function(req, res) {
    // find location by id
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            
        } else {
            res.render('comments/new', { location: location })
        }
    })
})

// create comments route
app.post('/locations/:id/comments', isSignedIn, function(req, res) {
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

// signin form route
app.get('/signin', function(req, res) {
    res.render('signin')
})

// handle signin logic
app.post('/signin', passport.authenticate('local', 
    { 
        successRedirect: '/locations', 
        failureRedirect: '/signin'
    }), function(req, res) {

})

// signout route
app.get('/signout', function(req, res) {
    req.logOut();
    res.redirect('/locations');
})


// middleware
function isSignedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/signin');
}


// requiring routes
app.use(locationRoutes);


// Tell Express to listen for requests (start server)
app.listen(8000, function(){
    console.log('Out On Keto server has started on port 8000');
})