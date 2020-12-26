# FoodieCritic
FoodieCritic is a full stack web application project that is built on MongoDB/Express/Node while utilising RESTful architecture. It performs CRUD operations for users. 
Users are able to upload images, food reviews, comment on other reviews and give ratings.

## Deployment
To try out the app, head to https://foodiecritic.herokuapp.com.

## Features
* Authentication - User authorization and authentication in place for various routes, utilizing Passport.js and related submodules.
* Authorisation - Users are unable to upload, delete or edit their reviews/comments without being signed-in.
* Uploading images and food reviews
* Commenting on reviews
* Deleting reviews and comments
* Editing reviews and comments
* Rating reviews/food places
* Flash messages to handle error/success events

## Tech-stack
### Front-end
* [ejs](http://ejs.co/)
* CSS
* Bootstrap

### Back-end and important npm modules
* [mongoDB Atlas](https://www.mongodb.com/)
* [express](https://expressjs.com/)
* express-sanitizer
* [mongoose](http://mongoosejs.com/)
* [passport](http://www.passportjs.org/)
* passport-local-mongoose
* [express-session](https://github.com/expressjs/session#express-session)
* [method-override](https://github.com/expressjs/method-override#method-override)
* [passport-local](https://github.com/jaredhanson/passport-local#passport-local/)
* [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash/)



