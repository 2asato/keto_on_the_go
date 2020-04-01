var mongoose = require('mongoose');
var Location = require('./models/location');

// seed data
var data = [
    {
        name: 'The Walrus and the Carpenter',
        neighborhood: 'Ballard',
        restaurantType: 'Restaurant',
        foodType: 'Seafood',
        description: 'The Walrus remains a neighborhood spot — a friendly, often bustling, always casual, place to enjoy icy cold piles of oysters, delicious plates, wines by the glass, beer, cider, and smart cocktails.',
        menuItem: {
            name: 'Oysters',
            description: 'Great variety',
            // carbs: Number,
            // price: { type: Currency }
            image: 'https://www.thewalrusbar.com/uploads/_900x900_fit_center-center_85_none/walrus-photo-1.jpg'
        },
        website: 'www.thewalrusbar.com/',
        menu: 'www.thewalrusbar.com/menu/',
        yelp: 'www.yelp.com/biz/the-walrus-and-the-carpenter-seattle',
        kids: 'Yes',
        image: 'https://www.thewalrusbar.com/uploads/_900x900_fit_center-center_85_none/Walrus01.jpg',
        hours: 'Mon - Sun  4pm - 10pm',
        phoneNumber: '(206)395-9227',
        address: {
            street: '4743 Ballard ave NW',
            city: 'Seattle',
            state: 'WA',
            zip: '98107',      
        },
    
    
    },
    {
        name: 'The Pink Door',
        neighborhood: 'Pike Place',
        restaurantType: 'Restaurant',
        foodType: 'Italian',
        description: 'The Pink Door serves delicious, uncomplicated Italian-American food during lunch and dinner. Many offerings derive from La Padronas family recipes—inspired from weekly Sunday gatherings and days in her grandfathers garden.',
        menuItem: {
            name: 'Cioppino',
            description: 'pink door prawns, rock fish, mussels, clams and calamari in a spicy tomato and white wine broth',
            // carbs: Number,
            price: 2700,
            image: 'https://images.squarespace-cdn.com/content/v1/574335cf59827e45443e86b7/1481661521133-9GAVAI1T5MZ4ZVKZWAA8/ke17ZwdGBToddI8pDm48kFyD7pzB8zoMIVY5aiUuFlp7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0jG2lbcDYBOeMi4OFSYem8DMb5PTLoEDdB05UqhYu-xbnSznFxIRsaAU-3g5IaylIg/The+Pink+Door-4.jpg?format=1500w',
        },
        website: 'www.thepinkdoor.net/',
        menu: 'www.thepinkdoor.net/menus',
        kids: 'Yes',
        image: 'https://images.squarespace-cdn.com/content/v1/574335cf59827e45443e86b7/1503937961211-E9WF95ZHXPJEO11Z5PIM/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/4A3A4021.jpg',
        hours: 'Mon - Thu  11:30pm - 11:30pm, Fri - Sat  11:30pm - 1am, Sun  4pm - 10pm',
        phoneNumber: '(206)443-13241'
    
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