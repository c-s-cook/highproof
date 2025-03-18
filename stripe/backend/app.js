var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dynamo = require('./dynamo')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.get('/add-vouchers', (req, res) => res.render('add-vouchers', { title: 'Add New Vouchers' }));
app.get('/vouchers', (req, res) => res.render('vouchers', { title: 'Vouchers' }));
app.get('/customers', (req, res) => res.render('customers', { title: 'Customers' }));
app.get('/tours', (req, res) => res.render('tours', { title: 'Tours' }));
app.get('/transactions', (req, res) => res.render('transactions', { title: 'Transactions' }));

app.get('/api/query-table', async (req, res) => {
  let response = await dynamo.getTours();
  console.log("...in API...");
  console.log(response)
  res.json(response)
});


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
