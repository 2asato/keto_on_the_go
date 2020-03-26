var mongoose = require('mongoose'),
    Currency = mongoose.Types.Currency;

// location schema setup
var locationSchema = new mongoose.Schema({
    name: String,
    neighborhood: String,
    type: String,
    flavorProfile: String,
    description: String,
    menuItem: {
        name: String,
        description: String,
        carbs: Number,
        price: { type: Currency },
        image: String
    },
    website: String,
    menu: String,
    yelp: String,
    kids: String,
    image: String,
    hours: String,
    phoneNumber: String,
});

// location model
module.exports = mongoose.model('Location', locationSchema);