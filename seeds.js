var mongoose = require('mongoose');
var Location = require('./models/location');

// seed data
var data = [
    {
        name: 'The Walrus and the Carpenter',
        neighborhood: 'Ballard',
        type: 'Restaurant',
        flavorProfile: 'Seafood',
        description: 'The Walrus remains a neighborhood spot — a friendly, often bustling, always casual, place to enjoy icy cold piles of oysters, delicious plates, wines by the glass, beer, cider, and smart cocktails.',
        menuItem: {
            name: 'Oysters',
            description: 'Great variety',
            // carbs: Number,
            // price: { type: Currency }
            image: 'https://www.thewalrusbar.com/uploads/_900x900_fit_center-center_85_none/walrus-photo-1.jpg'
        },
        links: 'https://www.thewalrusbar.com/',
        kids: 'Yes',
        image: 'https://www.thewalrusbar.com/uploads/_900x900_fit_center-center_85_none/Walrus01.jpg'
    
    }
]

// seed db
function seedDB() {
    // remove locations to not clutter DB
    Location.deleteMany({}, function(err) {
        if(err) {
            console.log(err);
            
        } else {
            console.log('deleted locations');
            
        }
    })
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