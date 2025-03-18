
TABLE: VM_VOUCHER_CODES
 - VOUCHER_ID: Str PARTITION KEY
 - TOUR: Str  SORT KEY
 - CODE: str
 - LINK: str
 - AVAILABLE: Boolean
 - CREATED: Date()
 - PURCHASED: Date()
 - TRANSACTION_ID: Str / Foreign Key



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
   




1. Lambda Receive Stripe Event
    - get Name + Contact
    - get tour Name
2. Grab next new Code(s)
    - UPDATE that code as NOT Available, and update Purcahse Date
3. CREATE new Customer
3. Email Customer Code + Instructions