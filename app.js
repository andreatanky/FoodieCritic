if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/foodiecritic';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const ExpressError = require('./utils/ExpressError');
const { connected } = require('process');
const Restaurant = require('./models/restaurant');
const { urlencoded } = require('body-parser');
const Joi = require('joi');
const { restaurantSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const MongoDBStore = require("connect-mongo")(session);

const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
//'mongodb://localhost:27017/foodiecritic',

mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/assets', express.static('assets'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("session store error", e)
})

const sessionconfig = {
    store,
    name: 'cookiemonster',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        //secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'andrea@gmail.com', username: 'andrea'})
    const newUser = await User.register(user, 'dogs');
    res.send(newUser);
})

app.use('/restaurants', restaurantRoutes)
app.use('/restaurants/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong...'} = err;
    if (!err.message) {
        err.message = ('Oh No, Something went wrong');
    }
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})