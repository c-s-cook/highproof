var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stripe + VM Vouchers | High Proof', isDev: res.locals.isDev });
});

module.exports = router;
