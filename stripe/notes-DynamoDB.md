https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CheatSheet.html


DynamoDB QUeries:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html


https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-3.html





# TABLE STRUCTURES

TABLE: VM_VOUCHER_CODES
 - VOUCHER_ID: Str PARTITION KEY
 - TOUR_ID: Str  SORT KEY // Foreign Key
 - ///  CODE: - no need for this, the VOUCHER_ID is the code
 - LINK: str
 - AVAILABLE: Boolean
 - REDEEMED: Boolean // NEW!
 - CREATED: Date()
 - PURCHASED: Date()
 - TRANSACTION_ID: Str / Foreign Key



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
   - TRANSATION_ID: Str (Stripe event ID) PARTITION KEY
   - CUSTOMER: Str / Foreign Key
   - VOUCHER_IDS: {}
   - Date: Date()