https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CheatSheet.html


DynamoDB QUeries:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html





# TABLE STRUCTURES

TABLE: VM_VOUCHER_CODES
 - VOUCHER_ID: Str PARTITION KEY
 - TOUR_ID: Str  SORT KEY // Foreign Key
 - CODE: str
 - LINK: str
 - AVAILABLE: Boolean
 - CREATED: Date()
 - PURCHASED: Date()
 - TRANSACTION_ID: Str / Foreign Key



TABLE:  TOURS
 - TOUR_ID: Str PARTITION KEY
 - TITLE: []
 



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