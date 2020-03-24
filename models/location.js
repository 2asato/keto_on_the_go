var mongoose = require('mongoose'),
    Currency = mongoose.Types.Currency;

// location schema setup
var locationSchema = new mongoose.Schema({
    name: String,
    neighborhood: String,
    type: String,
    flavorProfile: String,
    menuItem: {
        name: String,
        description: String,
        carbs: Number,
        price: { type: Currency }
    },
    links: String,
    kids: String,
    images: String
});

// location model
module.exports = mongoose.model('Location', locationSchema);