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



// **************
//  VOUCHER API's
// **************

// API to add a voucher to the VM_VOUCHER_CODE table. It receives a POST request that follows the Voucher interface from dynamo.ts...
app.post('/api/add-voucher', async (req, res) => {
  console.log("...in add-voucher API...");
  console.log(req.body);
  let voucher = req.body;
  try {
    let response = await dynamo.createVoucher(voucher);
    // console.log(response);
    res.json({ success: true, message: `Voucher ${voucher.VOUCHER_ID} added successfully!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add voucher." });
  }
});

// API to get all vouchers for a specific TOUR_NUM from the VM_VOUCHER_CODES table. It receives a GET request with the TOUR_NUM parameter...
app.get('/api/tour-vouchers/:TOUR_NUM', async (req, res) => {
  console.log("...in get-vouchers API...");
  const { TOUR_NUM } = req.params;
  try {
    // Call the function to get vouchers for the specified TOUR_NUM from the DynamoDB table
    let response = await dynamo.getVouchersByTour(TOUR_NUM);
    console.log(response);
    // Send a JSON response with the retrieved vouchers
    res.json({ success: true, vouchers: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve vouchers." });
  }
});


// API to get the 0000_MOST_RECENT voucher in the VM_VOUCHER_CODES table...
app.get('/api/get-latest-voucher', async (req, res) => {
  console.log("...in get-latest-voucher API...");
  try {
    // Call the function to get vouchers for the specified TOUR_NUM from the DynamoDB table
    let response = await dynamo.getMostRecentVoucher();
    console.log(response);
    // Send a JSON response with the retrieved voucher
    res.json({ success: true, voucher: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to retrieve the single, most recent, voucher." });
  }
});

// API to update the CREATED value of the 0000_MOST_RECENT voucher...
app.get('/api/update-latest-voucher/:CREATED', async (req, res) => {
  console.log("...in update-latest-voucher API...");
  const { CREATED } = req.params;
  // console.log('CREATED = ', CREATED);
  try {
    let response = await dynamo.updateMostRecentVoucher(CREATED);
    console.log('updateLatestVoucher response: ', response);
    res.json({ success: true, voucher: response.Attributes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update 0000_MOST_RECENT." });
  }
})




// API to retreive a specific VOUCHER_ID from the VM_VOUCHER_CODES table...
app.get('/api/vouchers/:VOUCHER_ID', async (req, res) => {
  console.log("...in get-voucher-by-id API...");
  const { VOUCHER_ID } = req.params;
  try {
    // Call the function to get vouchers for the specified TOUR_NUM from the DynamoDB table
    let response = await dynamo.getVoucherById(VOUCHER_ID);
    // console.log("from app.js -", response);
    // Send a JSON response with the retrieved voucher
    res.json({ success: true, voucher: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `Failed to find voucher with ID ${VOUCHER_ID} .` });
  }
});



// ************
//  TOUR API's
// ************


//  API to get all items/tours in the TOURS table...
app.get('/api/query-table', async (req, res) => {
  let response = await dynamo.getTours();
  console.log("...in getTours() API...");
  console.log(response)
  res.json(response)
});

// API to create a Tour in the TOURS table. It receives a POST request containing TOUR_REGION, TOUR_NUM, and TITLES...
app.post('/api/create-tour', async (req, res) => {
  console.log("...in create-tour API...");
  console.log(req.body);
  const { TOUR_REGION, TOUR_NUM, TITLES, VM_PUBLISHED } = req.body;
  console.log( TOUR_REGION, TOUR_NUM, TITLES, VM_PUBLISHED )
  try {
    // Call the function to create a new tour in the DynamoDB table
    let response = await dynamo.createTour( TOUR_REGION, TOUR_NUM, TITLES, VM_PUBLISHED );
    console.log(response);
    // Send a JSON response indicating success
    res.json({ success: true, message: "Tour created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create tour." });
  }
});



// API to update a Tour in the TOURS table. It receives a POST request containing a Tour object that follows the Tour interface from dynamo.ts...
app.post('/api/update-tour', async (req, res) => {
  console.log("...in update-tour API...");
  console.log(req.body);
  const { TOUR_REGION, TOUR_NUM, TITLES } = req.body;
  try {
    let response = await dynamo.updateTour(TOUR_REGION, TOUR_NUM, TITLES);
    console.log(response);
    res.json({ success: true, message: "Tour updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update tour." });
  }
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
