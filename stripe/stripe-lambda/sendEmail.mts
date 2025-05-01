import { renderFile } from 'ejs';
import { createTransport } from 'nodemailer';
import 'dotenv/config';

// import types
import type { Voucher, PurchaseInfo } from './types.mts';




let imgSrc = 'https://highproofproductions.com/wp-content/uploads/2024/08/high-proof-productions-text-logo-sm-light-e1731699899945.png';

let purchaseInfoDev: PurchaseInfo = {
    name: 'Brainroot',
    email: 'testing2@brainroot.tv',
    tourTitle: 'Tour Title Test',
    vouchers: [
        {
            VOUCHER_ID: '1234567890',
            TOUR_NUM: 1,
            LINK: 'https://highproofproductions.com/tour-link?id=1',
            CREATED: new Date().valueOf(),
            AVAILABLE: true,
            REDEEMED: false,
        },
        {
            VOUCHER_ID: 'ABCDEFGHIJ',
            TOUR_NUM: 1,
            LINK: 'https://highproofproductions.com/tour-link?id=2',
            CREATED: new Date().valueOf(),
            AVAILABLE: true,
            REDEEMED: false,
        },
    ],
    startingLocation: 'Jim Beam Distillery',
};



// create reusable transporter object using the default SMTP transport
const transporter = createTransport({
    pool: true,
    host: 'smtp.dreamhost.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.HPP_EMAIL, // generated ethereal user
        pass: process.env.HPP_EMAIL_PSWD, // generated ethereal password
    },
});


// render email HTML from EJS template using the purchaseInfo object
export const renderHTML = async (purchaseInfo: PurchaseInfo) => {



    let { name, email, tourTitle, vouchers, startingLocation } = purchaseInfo;
    startingLocation = startingLocation || 'your first distillery';

    try {
        // render the HTML from the EJS template
        const html = await renderFile('./email-templates/tmplt_confirmation.ejs', {
            name,
            email,
            tourTitle,
            vouchers,
            startingLocation,
            imgSrc,
        });
        console.log('HTML rendered successfully:\n\n', html);
        return html;
    } catch (error) {
        console.error('Error rendering HTML:', error);
        throw error;
    }
};


// a function that receives a purchaseInfo oject, uses the renderHTML function to create the HTML, and sends the email
export const sendEmail = async (purchaseInfo: PurchaseInfo) => {
    try {
        // render the HTML from the EJS template
        const html = await renderHTML(purchaseInfo);

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"High Proof Tours" <${process.env.HPP_EMAIL}>`, // sender address
            to: purchaseInfo.email, // list of receivers
            subject: `Your drive is about to come alive! | ${purchaseInfo.tourTitle}`, // Subject line
            text: 'Hello world?', // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

if (process.env.IS_DEV == 'true') sendEmail(purchaseInfoDev);