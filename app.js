var express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    mongooseCurrency = require('mongoose-currency').loadType(mongoose),
    Location = require('./models/location')
    seedDB = require('./seeds');



// connect mongoose
mongoose.connect('mongodb://localhost/out_on_keto', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// run seedDB
seedDB();
    

// landing page
app.get('/', function(req, res) {
    res.render('landing')
})

// locations index page
app.get('/locations', function(req, res) {
    Location.find({}, function(err, allLocations) {
        if(err) {
            console.log(err);
            
        } else {
            res.render('locations/index', { locations:allLocations });

        }
    })
})

// Tell Express to listen for requests (start server)
app.listen(3000, function(){
    console.log('Out On Keto server has started on port 3000');
})