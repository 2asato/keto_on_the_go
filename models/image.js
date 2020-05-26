var mongoose = require('mongoose');

// schema
var imageSchema = new mongoose.Schema({
    url: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    added: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Image', imageSchema);