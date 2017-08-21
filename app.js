var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var upload = require('express-fileupload'); // example: https://www.npmjs.com/package/express-fileupload

var appRoutes = require('./routes/app');
var couponRoutes = require('./routes/coupon');
var userRoutes = require('./routes/user');
var businessRoutes = require('./routes/business');
var categoryRoutes = require('./routes/category');
var couponTypeRoutes = require('./routes/coupon_type');
var locationRoutes = require('./routes/location');
var uploadRoutes = require('./routes/upload');

var app = express();
//switch to production db when deploying
mongoose.connect('127.0.0.1:27017/clapp-members');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCh, DELETE, OPTIONS');
  next();
});

app.use('/coupon', couponRoutes);
app.use('/user', userRoutes);
app.use('/business', businessRoutes);
app.use('/category', categoryRoutes);
app.use('/coupon_type', couponTypeRoutes);
app.use('/location', locationRoutes);
app.use('/upload', uploadRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('index');
});

module.exports = app;
