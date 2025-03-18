import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);  // Replace with your Stripe secret key

export const handler = async (event) => {
    
    const sig = event.headers['Stripe-Signature'];

    let stripeEvent;

    try {

        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    } catch (err) {

        return { statusCode: 400, body: `Webhook Error: ${err.message}` };

    }

    // Handle the event

    switch (stripeEvent.type) {

        case 'payment_intent.succeeded':

            const paymentIntent = stripeEvent.data.object;

            // Then define and call a method to handle the successful payment intent.

            break;

        // ... handle other event types

        default:

            console.log(`Unhandled event type ${stripeEvent.type}`);

    }

    return { statusCode: 200, body: 'Success' };

}