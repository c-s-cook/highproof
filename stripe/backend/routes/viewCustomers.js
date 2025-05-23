var express = require('express');
var router = express.Router();

var dynamo = require('../dynamo');


/* GET View Vouchers page. */
router.get('/customers/:customerId?', async function(req, res, next) {

  console.log(encodeURIComponent('lefting@brainroot.tv'));

  let customers = [];
  if (req.params.customerId) {
    let { customerId } = req.params;
    console.log('decoding = ', decodeURIComponent(customerId));
    if (customerId) {
      let response = await dynamo.getCustomerById(customerId);
      customers.push(response);
    }
  } else {
    customers = await dynamo.getAllCustomers();
  }


  console.log("/customers call = ", customers.length);

  
  res.render('customers', { title: 'View Customers', isDev: res.locals.isDev, customers: customers });
});

module.exports = router;
