var express = require('express'), 
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose')

// connect mongoose
mongoose.connect('mongodb://localhost/out_on_keto', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
    

// landing page
app.get('/', function(req, res) {
    res.render('landing')
})

// Tell Express to listen for requests (start server)
app.listen(3000, function(){
    console.log('Out On Keto server has started on port 3000');
})