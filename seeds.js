var mongoose = require('mongoose');
var Location = require('./models/location');

// seed data
var data = [
    {
        name: 'The Walrus and the Carpenter',
        neighborhood: 'Ballard',
        type: 'Restaurant',
        flavorProfile: 'Seafood',
        menuItem: {
            name: 'Oysters',
            description: 'Great variety',
            // carbs: Number,
            // price: { type: Currency }
        },
        links: 'https://www.thewalrusbar.com/',
        kids: 'Yes',
        images: 'https://www.thewalrusbar.com/uploads/_900x900_fit_center-center_85_none/Walrus01.jpg'
    
    }
]

// seed db
function seedDB() {
    data.forEach(function(seed) {
        Location.create(seed, function(err, location) {
            if(err) {
                console.log(err);
                
            } else {
                console.log('added a location');
                
            }
        })
    })
}

module.exports = seedDB;