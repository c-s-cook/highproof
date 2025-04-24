import stripePackage from 'stripe';
import 'dotenv/config';
import  { getTourVoucher, updateVoucher, findCustomer, createCustomer, updateCustomer, recordTransaction } from './dynamo.mjs';

let isDev = process.env.IS_DEV == 'true' ? true : false;
let isLocal = process.env.IS_LOCAL == 'true' ? true : false;

let stripeSecretKey = isDev ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;
let stripeWebhookSecret = isDev ? process.env.STRIPE_WEBHOOK_SECRET_TEST : process.env.STRIPE_WEBHOOK_SECRET;
let checkoutSessionID = isLocal ? 'cs_test_b1e6LTtHiVtuV1KwxEE4HNQHfaDqltC0vdNM9XzmyQKfiTI4RBg1Bg8RcK' : null;


const stripe = stripePackage(stripeSecretKey);  // Replace with your Stripe secret key


const getTransactionDetails = async (csID = checkoutSessionID) => {

    const session = await stripe.checkout.sessions.retrieve(csID, {
        expand: ['line_items.data.price.product']
    });

    return {
        tourIDs: session.line_items.data[0].price.product.metadata.TOUR_IDS.split(', '),
        tourTitle: session.line_items.data[0].price.product.name,
        customer: session.customer_details,
        created: new Date().getTime()
    }
}



const runDynamoActions = async (stripeEvent) => {
    checkoutSessionID = stripeEvent.data.object.id ? stripeEvent.data.object.id : checkoutSessionID;
    let purchaseInfo = await getTransactionDetails(checkoutSessionID)
    console.log('purchaseInfo = ', purchaseInfo);
    // purchaseInfo.tourTitle = '{The Tour Title}'

    let vouchers = [];
    let voucherWarnings = [];
    let customer = null;
    let voucherIDs = [];

    // get the vouchers for each tourID in the purchaseInfo
    for (const tourID of purchaseInfo.tourIDs) {
        console.log('seeking voucher for tourID ', tourID);
        let voucherResult = await getTourVoucher(Number(tourID));
        if (voucherResult) vouchers.push(voucherResult.voucher);
        if (voucherResult.count < 10) voucherWarnings.push(voucherResult);
        console.log(`${tourID} voucher = `, voucherResult.voucher);
        console.log('vouchers = ', vouchers);
    }

    if (voucherWarnings.length > 0) console.log('fire off warning email to admin');
    // TO DO:  write email function for sending message to admin if voucher count is low

    // check that vouchers were found for all tourIDs
    if (vouchers.length == purchaseInfo.tourIDs.length) {
        console.log('all vouchers found = ', vouchers);
        voucherIDs = vouchers.map(v => v.VOUCHER_ID);
        console.log('voucherIDs = ', voucherIDs);
        

        // update the vouchers to mark them as used
        for (let i = 0; i < vouchers.length; i++) {
            await updateVoucher(vouchers[i].VOUCHER_ID, checkoutSessionID, purchaseInfo.created);
        }

        // look up the customer in the database
        customer = await findCustomer(purchaseInfo.customer.email);
        if (!customer) {
            // create a customer if they don't exist
            customer = await createCustomer(purchaseInfo.customer.email, checkoutSessionID, purchaseInfo.customer.name, purchaseInfo.customer.address);
        } else {
            console.log('customer = ', customer);
            // check if the customer details need to be updated
            if (customer.NAME != purchaseInfo.customer.name) {
                console.log('updating customer name from ', customer.NAME, ' to ', purchaseInfo.customer.name);
                if (customer.ADDRESS != purchaseInfo.customer.address) {
                    console.log('updating customer address from ', customer.ADDRESS, ' to ', purchaseInfo.customer.address);
                    console.log(await updateCustomer(customer.CUSTOMER, checkoutSessionID, purchaseInfo.customer.name, purchaseInfo.customer.address));
                } else {
                    console.log(await updateCustomer(customer.CUSTOMER, checkoutSessionID, purchaseInfo.customer.name));
                }
            } else {
                // if no details-update needed, just add the new checkout session ID to the customer record
                console.log(await updateCustomer(customer.CUSTOMER, checkoutSessionID));
            }
        }

        // record the transaction
        let transaction = await recordTransaction(checkoutSessionID, purchaseInfo.customer.email, purchaseInfo.created, voucherIDs)
        console.log(transaction);    

    } else {
        console.log('not all vouchers found for tourIDs = ', purchaseInfo.tourIDs);
        console.log('vouchers = ', vouchers);
        console.log('voucherIDs = ', voucherIDs);
    }

    console.log('\n\n\n\n\n Tour Title = ', purchaseInfo.tourTitle);
    console.log('Tour IDs = ', purchaseInfo.tourIDs);
    console.log('voucherIDs = ', voucherIDs);
    console.log('customer = ', purchaseInfo.customer);
    console.log('created = ', purchaseInfo.created);
    console.log('checkoutSessionID = ', checkoutSessionID);
}




export const handler = async (event) => {
      
    console.log('event.body.type = ', event.body.type);
    // if (event.body.type != 'checkout.session.completed') return
    
    const sig = event.headers['Stripe-Signature'];

    let stripeEvent;

    try {

        stripeEvent = stripe.webhooks.constructEvent(event.rawBody, sig, stripeWebhookSecret);
        console.log('stripeEvent = ', stripeEvent);

    } catch (err) {

        console.log('err = ', err);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };

    }

    // Handle the event

    switch (stripeEvent.type) {

        case 'checkout.session.completed':

            await runDynamoActions(stripeEvent);

            break;

        // ... handle other event types

        case 'payment_intent.succeeded':

            const paymentIntent = stripeEvent.data.object;
            console.log('paymentIntent = ', paymentIntent);

        default:

            console.log(`Unhandled event type ${stripeEvent.type}`);

    }

    return { statusCode: 200, body: 'Success' };

}

if (isLocal) await runDynamoActions({ data: { object: { id: checkoutSessionID } } });
