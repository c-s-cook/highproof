import stripePackage from 'stripe';
import 'dotenv/config';

let isDev = true;

let stripeSecretKey = isDev ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;
let stripeWebhookSecret = isDev ? process.env.STRIPE_WEBHOOK_SECRET_TEST : process.env.STRIPE_WEBHOOK_SECRET;
let checkoutSessionDevID = isDev ? 'cs_test_b1e6LTtHiVtuV1KwxEE4HNQHfaDqltC0vdNM9XzmyQKfiTI4RBg1Bg8RcK' : null;


const stripe = stripePackage(stripeSecretKey);  // Replace with your Stripe secret key


const getTransactionDetails = async (csID = checkoutSessionDevID) => {

    const session = await stripe.checkout.sessions.retrieve(csID, {
        expand: ['line_items.data.price.product']
    });

    return {
        tourIDs: session.line_items.data[0].price.product.metadata.TOUR_IDS,
        tourTitle: session.line_items.data[0].price.product.name,
        customer: session.customer_details
    }
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

            let purchaseInfo = await getTransactionDetails(stripeEvent.data.object.id)
            console.log('purchaseInfo = ', purchaseInfo);

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