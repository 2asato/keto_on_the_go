var mongoose = require('mongoose');

// schema
var ketoOptionSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    image: String,
    carbs: String,
    location: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location'
        },
        name: String
    }
})

module.exports = mongoose.model('KetoOption', ketoOptionSchema);