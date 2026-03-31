# Stripe Purchase Processor | High Proof Productions
An AWS Lambda function acting as a Stripe webhook to email customers their tour voucher code(s). 

When a customer completes a tour purchase on the Stripe 'Payment Link' page, Stripes sends the transaction record to this function, via API Gateway. This function then:

1. Confirms that the transaction type was 'checkout.session.completed'
2. Calls back to Stripe to attain the full Stripe Event
3. Extracts the customer info & tour item (product) details from the Stripe Event
4. Performs a series of CRUD actions on DynamoDB tables, such as
    - Obtains Available voucher code(s) and updates to mark them Unavailable
    - If the number of available voucher codes (inventory) is getting low, it emails me / admins
    - Looks up customer (email address) and creates new customer if not found
    - Records the transaction
    - Sends the customer a templated (EJS) email with all the necessary info



## DEV / PRODUCTION
I have two versions of the function live, each with their own API Gateway router (CORS enabled). I've manually created two Environment Variables in each. All other ENV calls rely on the .env file included with the package.
- Production: "stripeProcessPayment"
    - IS_DEV='false'
    - IS_LOCAL='false'
- Development: "stripeProcessPayment_TEST"
    - IS_DEV='true'
    - IS_LOCAL='false'

NOTE: The IS_LOCAL variable is listed in the .env as 'true', but the value manually entered into the lambda function takes precedence.  Also, this is an old value/construct used in first stages of learning to work with the Stripe Checkout.Session object, and has been commented out. Will delete after next tests.




