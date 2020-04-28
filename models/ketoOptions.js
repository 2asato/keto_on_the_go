var mongoose = require('mongoose');

// schema
var ketoOptionSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    image: String,
    carbs: Number
})

module.exports = mongoose.model('KetoOption', ketoOptionSchema);