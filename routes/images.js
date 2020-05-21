var express = require('express'),
    router = express.Router({mergeParams: true}),
    Location = require('../models/location'),
    middleware = require('../middleware')