var express = require('express');
var router = express.Router();

var dynamo = require('../dynamo');


/* GET View Vouchers page. */
router.get('/transactions/:transactionId?', async function(req, res, next) {

  let transactions = [];
  if (req.params.transactionId) {
    let { transactionId } = req.params;
    console.log(transactionId);
    
    if (transactionId) {
      let response = await dynamo.getTransactionById(transactionId);
      transactions.push(response);
    }
  } else {
    transactions = await dynamo.getAllTransactions();
  }


  console.log("/transactions call = ", transactions.length);

  
  res.render('transactions', { title: 'View Transactions', isDev: res.locals.isDev, transactions: transactions });
});

module.exports = router;
