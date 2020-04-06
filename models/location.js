var mongoose = require('mongoose'),
    Currency = mongoose.Types.Currency;

// location schema setup
var locationSchema = new mongoose.Schema({
    name: String,
    neighborhood: String,
    restaurantType: String,
    foodType: String,
    description: String,
    menuItem: {
        name: String,
        description: String,
        carbs: Number,
        price: String,
        image: String
    },
    website: String,
    menu: String,
    yelp: String,
    kids: String,
    image: String,
    hours: String,
    phoneNumber: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,      
    },
    daysOpen: String,
    serves: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

// location model
module.exports = mongoose.model('Location', locationSchema);