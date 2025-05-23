var express = require('express');
var router = express.Router();

var dynamo = require('../dynamo');


/* GET View Vouchers page. */
router.get('/tours', async function(req, res, next) {


  let response = await dynamo.getTours();
  let tours = response.Items;
  console.log("/tours tours call = ", tours);

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


    };
  };
  console.log("all done with .forEach()...")

  res.render('tours', { title: 'View Tours', isDev: res.locals.isDev, tours: tours });
});

module.exports = router;
