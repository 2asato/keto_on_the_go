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


var locationRoutes = require('./routes/locations'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index')


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


// requiring routes
app.use(locationRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


// Tell Express to listen for requests (start server)
app.listen(8000, function(){
    console.log('Out On Keto server has started on port 8000');
})