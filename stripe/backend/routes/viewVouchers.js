var express = require('express');
var router = express.Router();

var dynamo = require('../dynamo');


/* GET View Vouchers page. */
router.get('/vouchers/:voucherId?', async function(req, res, next) {

  var vouchers = [];
  let response = await dynamo.getTours();
  let tours = response.Items;
  console.log("/vouchers tours call = ", tours);

  if (tours) {
    // tours.forEach(async (tour) => {
    for (let t = 0; t < tours.length; t++) {
      console.log("seeking vouchers for TOUR_NUM ", tours[t].TOUR_NUM, "...");
      const tourVouchers = await dynamo.getVouchersByTour(tours[t].TOUR_NUM);
      if (!tourVouchers) {
        console.error(`Error fetching vouchers for tour ${tours[t].TOUR_NUM}:`, tourVouchers.statusText);
        break;
      }
      // const vouchersData = await tourVouchers.json();
      console.log("tourVouchers = ", tourVouchers.length);
      console.log("available: ", tourVouchers.filter((tour) => tour.AVAILABLE).length)
      tours[t].TOTAL = tourVouchers.length;
      tours[t].AVAILABLE = tourVouchers.filter((tour) => tour.AVAILABLE).length;
      vouchers.push(...tourVouchers);
      console.log('vouchers lengths now = ', vouchers.length, '\n\n\n\n');

    };
  };
  console.log("all done with .forEach()...")

  res.render('vouchers', { title: 'View Vouchers', isDev: res.locals.isDev, tours: tours, vouchers: vouchers });
});

module.exports = router;
