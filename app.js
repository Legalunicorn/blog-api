var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")

// import the passport config
const passportSetup = require("./config/passport-setup")
 

require("dotenv").config(); // environment variables

const authRouter = require("./routes/authRoutes")
const articleRouter = require('./routes/articleRoutes')
const likeRouter = require("./routes/likeRoutes")
var indexRouter = require('./routes/index');

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


//TODO enable cors, read up first



/**
 * ========== ROUTES ===============
 */


//TODO use all the imported routes:
app.use('/auth',authRouter);
app.use('/articles',articleRouter);
app.use('/like',likeRouter)
app.use('/', indexRouter);

// catch 404 and forward to error handler
//In Express, 404 responses are not the result of an error, 
//so the error-handler middleware will not capture them
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
//the use a custom error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use(function(err,req,res,next){
  //log the error
  console.log(`Errors: ${err.message}`);
  console.error(err.stack)
  res.header('Content-Type','application/json')
  const status = err.status || 400; //bad request
  //TODO lookup cast error
  if (err.name==="CastError"){
    res.status(status).json({
      error: `Invalid  ${err.path} : ${err.value}`,sucess:false //TODO look up success false
    })
  }
  //not cast error
  res.status(status).json({error:err.message || 'Something went wrong',sucess:false});
})

//TODO figure out how this works
//apparently 404 is handled separately
app.use(function(req,res,next){
  res.status(404).json({error:"Invalid Path"})
})

module.exports = app;


//using reactjs as frontned, no need for template enginge
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
