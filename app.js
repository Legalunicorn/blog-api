var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")

// import the passport config
const passportSetup = require("./config/passport-setup")
 

require("dotenv").config(); // environment variables

//TODO create article routes
//TODO create comments routes
//TODO create likes routes
//TODO create auth routes
const authRouter = require("./routes/auth")
const articleRouter = require('./routes/articles')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// SET UP DB CONNECTION
mongoose.set("strictQuery",false);
const mongoDB = process.env.MONGO_URI;
main().catch(err=>console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//TODO set up passport then initialize it with the app below
//

//TODO enable cors, read up first



/**
 * ========== ROUTES ===============
 */


//TODO use all the imported routes:
app.use('/auth',authRouter);
app.use('/articles',articleRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//using reactjs as frontned, no need for template enginge
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
