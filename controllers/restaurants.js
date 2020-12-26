const Restaurant = require('../models/restaurant');

module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants });
}

module.exports.createRestaurant = async (req, res, next) => {
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Successfully created a review!');
    res.redirect(`/restaurants/${restaurant._id}`);
}

module.exports.rendernewForm = (req, res) => {
    res.render('restaurants/new');
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id)
    if(!restaurant) {
        req.flash('error', 'Cannot find review!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurant });
}

module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {... req.body.restaurant});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    restaurant.images.push(...imgs);
    await restaurant.save();
    req.flash('success', 'Successfully updated review!');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.showRestaurant = async (req, res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
    }}).populate('author');
    if(!restaurant) {
        req.flash('error', 'Cannot find review!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted review!');
    res.redirect('/restaurants');
}

