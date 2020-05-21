require('dotenv').config();

var express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    Location = require('./models/location'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    KetoOption = require('./models/ketoOption'),
    seedDB = require('./seeds');


var locationRoutes = require('./routes/locations'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index'),
    ketoOptionRoutes = require('./routes/ketoOptions'),
    imageRoutes = require('./routes/images')


    // connect mongoose
mongoose.connect('mongodb://localhost/seattle_on_keto', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());


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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})


// run seedDB
seedDB();
    

// landing page
app.get('/', function(req, res) {
    Location.find({}, function(err, allLocations) {
        if (err) {
            console.log(err);
            
        } else {
            res.render('landing', { locations: allLocations })
        }
    })
})


// requiring routes
app.use(locationRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
app.use(ketoOptionRoutes);
app.use(imageRoutes);


// Tell Express to listen for requests (start server)
app.listen(8000, function(){
    console.log('Out On Keto server has started on port 8000');
})