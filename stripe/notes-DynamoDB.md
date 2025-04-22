https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CheatSheet.html


DynamoDB QUeries:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html


https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-3.html





# TABLE STRUCTURES

TABLE: VM_VOUCHER_CODES
 - VOUCHER_ID: Str PARTITION KEY
 - TOUR_NUM: Number   // Foreign key to TOURS table + GSI
 - LINK: str
 - AVAILABLE: Boolean
 - REDEEMED: Boolean  // NEW!
 - CREATED: Number    // ms value of Date().valueOf()
 - PURCHASED: Number  // same ms value
 - TRANSACTION_ID: Str / Foreign Key to TRANSACTIONS table + GSI



TABLE:  TOURS
 - TOUR_REGION: Str PARTITION KEY
 - TOUR:  Num  SORT KEY
 - TITLES: []
 



 TABLE: CUSTOMERS
  - CUSTOMER: Str (their email) PARTITION KEY
  - CONTACT_INFO: {
      Name: str,
      Address: {}
    }
  - TRANSACTIONS: {}



  TABLE: TRANSATIONS
   - TRANSATION_ID: Str (Stripe Checkout.session ID) PARTITION KEY
   - CUSTOMER: Str / Foreign Key
   - VOUCHER_IDS: {}
   - Date: Date()