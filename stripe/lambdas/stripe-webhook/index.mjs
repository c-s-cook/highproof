import stripePackage from 'stripe';
import 'dotenv/config';
import  { getTourVoucher, updateVoucher, findCustomer, createCustomer, updateCustomer, recordTransaction } from './dynamo.mjs';
import { emailCustomerCodes, emailCustomerPending, emailAdmin } from './sendEmail.mjs';

let isDev = process.env.IS_DEV == 'true' ? true : false;


let stripeSecretKey = isDev ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;
let stripeWebhookSecret = isDev ? process.env.STRIPE_WEBHOOK_SECRET_TEST : process.env.STRIPE_WEBHOOK_SECRET;

// let isLocal = process.env.IS_LOCAL == 'true' ? true : false;
// let checkoutSessionID = isLocal ? 'cs_test_b1e6LTtHiVtuV1KwxEE4HNQHfaDqltC0vdNM9XzmyQKfiTI4RBg1Bg8RcK' : null;


const stripe = stripePackage(stripeSecretKey);  // Replace with your Stripe secret key


const getTransactionDetails = async (csID = checkoutSessionID) => {

    const session = await stripe.checkout.sessions.retrieve(csID, {
        expand: ['line_items.data.price.product']
    });

    return {
        tourIDs: session.line_items.data[0].price.product.metadata.TOUR_IDS.split(', '),
        startingLocation: session.line_items.data[0].price.product.metadata.STARTING_LOCATION.split(', '),
        tourTitle: session.line_items.data[0].price.product.name,
        customer: session.customer_details,
        created: new Date().getTime()
    }
}



const runDynamoActions = async (stripeEvent) => {
    // checkoutSessionID = stripeEvent.data.object.id ? stripeEvent.data.object.id : checkoutSessionID;
    let checkoutSessionID = stripeEvent.data.object.id;
    let purchaseInfo = await getTransactionDetails(checkoutSessionID)
    console.log('purchaseInfo = ', purchaseInfo);

    let vouchers = [];
    let voucherWarnings = [];
    let customer = null;
    let voucherIDs = [];

    // get the vouchers for each tourID in the purchaseInfo
    for (const tourID of purchaseInfo.tourIDs) {
        try {
            console.log('seeking voucher for tourID ', tourID);
            let voucherResult = await getTourVoucher(Number(tourID));
            if (voucherResult) vouchers.push(voucherResult.voucher);
            if (voucherResult.count < 10) voucherWarnings.push(voucherResult);
            console.log(`${tourID} voucher = `, voucherResult.voucher);
            console.log('vouchers = ', vouchers);
        } catch (error) {
            console.log('getTourVoucher() error = ', error)
        }

    }

    if (voucherWarnings.length > 0) {
        console.log("\n\nemailing admin about low voucher counts...");
        await emailAdmin({
            subject: 'Voucher count low',
            body: `The following vouchers have low counts: `,
            voucherWarning: voucherWarnings,
        })
    }



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

        try {
            // record the transaction
            let tourIDsNumbers = purchaseInfo.tourIDs.map(t => Number(t));  // convert to numbers
            console.log('tourIDsNumbers = ', tourIDsNumbers);

            let transaction = await recordTransaction(
                checkoutSessionID, 
                purchaseInfo.customer.email, 
                purchaseInfo.customer.name, 
                purchaseInfo.created, 
                voucherIDs,
                tourIDsNumbers,
                purchaseInfo.tourTitle,
            )
            console.log(transaction);
        } catch(error) {
            console.log('error = ', error);
        }
        console.log('moving on...');
        
        console.log('Got all the vouchers. Sending an email to customer with codes...');
        let emailCodesResults = await emailCustomerCodes({ 
            name: purchaseInfo.customer.name, 
            email: purchaseInfo.customer.email, 
            tourTitle: purchaseInfo.tourTitle, 
            vouchers: vouchers, 
            startingLocation: purchaseInfo.startingLocation
        });

        console.log('emailCodesResults = ', emailCodesResults);
        return 'success';
        

    } else {
        console.log('not all vouchers found for tourIDs = ', purchaseInfo.tourIDs);
        console.log('vouchers = ', vouchers);
        console.log('voucherIDs = ', voucherIDs);

        // email customer confirmation of purchase and pending vouchers
        console.log("Didn't get all the vouchers. Sending a Pending email...")
        let emailPendingResults = await emailCustomerPending({
            error: 'not all vouchers found for tourIDs', 
            name: purchaseInfo.customer.name, 
            email: purchaseInfo.customer.email, 
            tourTitle: purchaseInfo.tourTitle, 
            vouchers: vouchers, 
            startingLocation: purchaseInfo.startingLocation
        });
        console.log('emailPendingResults = ', emailPendingResults);

        // email the admin about the missing vouchers
        console.log('\n\nemailing admin about missing vouchers...');
        let emailAdminResults = await emailAdmin({
            subject: 'Voucher not found',
            body: `The following vouchers were not found for tourIDs: `,
            purchaseInfo: purchaseInfo,
            vouchers: vouchers,
            voucherIDs: voucherIDs,
            checkoutSessionID: checkoutSessionID,
        });
        console.log('emailAdminResults = ', emailAdminResults);

        return 'error';
    }

    // console.log('\n\n\n\n\n Tour Title = ', purchaseInfo.tourTitle);
    // console.log('Tour IDs = ', purchaseInfo.tourIDs);
    // console.log('voucherIDs = ', voucherIDs);
    // console.log('customer = ', purchaseInfo.customer);
    // console.log('created = ', purchaseInfo.created);
    // console.log('checkoutSessionID = ', checkoutSessionID);
}




export const handler = async (event) => {
      
    console.log('event.body.type = ', event.body.type);
    if (event.body.type != 'checkout.session.completed') {
        console.log("exiting the script since it wasn't a checkout.session.completed event.")
        return  { statusCode: 200, body: `Got it, but only running the script for checkout.session.completed. So this is the end. And, IS_DEV = ${IS_DEV}` };
    } 
    
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

            let emailInfo = await runDynamoActions(stripeEvent);
            
            break;

        // ... handle other event types
        case 'payment_intent.succeeded':

            const paymentIntent = stripeEvent.data.object;
            console.log('should not have gotten here, but paymentIntent = ', paymentIntent);

        default:

            console.log(`Unhandled event type ${stripeEvent.type}`);
            return { statusCode: 400, body: `Unhandled event type ${stripeEvent.type}` };

    }

    return { statusCode: 200, body: 'Success' };

}

// if (isLocal) await runDynamoActions({ data: { object: { id: checkoutSessionID } } });
