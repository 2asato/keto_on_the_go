var mongoose = require('mongoose'),
    Currency = mongoose.Types.Currency;

// location schema setup
var locationSchema = new mongoose.Schema({
    name: String,
    neighborhood: String,
    restaurantType: String,
    foodType: String,
    description: String,
    menuItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        }
    ],
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
     ],
     author: {
         id: {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'User'
         },
         username: String
     }
});

// location model
module.exports = mongoose.model('Location', locationSchema);