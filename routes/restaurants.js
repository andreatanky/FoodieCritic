const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const { restaurantSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateRestaurant } = require('../middleware');
const { populate } = require('../models/review');
const restaurants = require('../controllers/restaurants');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
.get(catchAsync(restaurants.index))
.post(isLoggedIn, upload.array('image'), validateRestaurant, catchAsync(restaurants.createRestaurant));
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.file);
//     res.send('it worked');
// })

router.get('/new', isLoggedIn, restaurants.rendernewForm)

router.route('/:id')
.get(catchAsync(restaurants.showRestaurant))
.put(isLoggedIn, validateRestaurant, isAuthor, catchAsync(restaurants.updateRestaurant))
.delete(isLoggedIn, catchAsync(restaurants.deleteRestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEditForm))

module.exports = router;