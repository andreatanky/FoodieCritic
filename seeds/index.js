const mongoose = require('mongoose');
const { connected } = require('process');
const Restaurant = require('../models/restaurant');
const cities = require('./cuisine');
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/foodiecritic', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]; //To pick a random element from the array

const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const rand = Math.floor(Math.random());
        const price = Math.floor(Math.random() * 20) + 10;
        const res = new Restaurant({
            author: '5fe2fe22bc8f15b918ba6a5e',
            location: `${cities[rand].cuisine}`,
            image: 'https://source.unsplash.com/collection/483251',
            //image: 'https://images.unsplash.com/photo-1483217067170-e62094708cd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8MXxyYW5kb218fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae iure consectetur ullam ea alias tenetur rerum eligendi perspiciatis, eveniet voluptatum magnam assumenda, minus sunt, iusto quod repellat excepturi architecto culpa.',
            price,
            images: [
                {
                    url: 'https://www.shutterstock.com/image-photo/gourmet-tasty-steak-burgers-ham-slices-316591013',
                    filename: 'YelpCamp/epwe4x9s3krapxyoqj3q'
                }
            ]
        })

        await res.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})