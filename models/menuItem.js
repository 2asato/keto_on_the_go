var mongoose = require('mongoose');

// schema
var menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    image: String,
    carbs: Number
})

module.exports = mongoose.model('MenuItem', menuItemSchema);