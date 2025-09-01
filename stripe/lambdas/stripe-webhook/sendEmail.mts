import { renderFile } from 'ejs';
import { createTransport } from 'nodemailer';
import 'dotenv/config';

// import types
import type { Voucher, EmailInfo } from './types.mts';




let imgSrc = 'https://highproofproductions.com/wp-content/uploads/2024/08/high-proof-productions-text-logo-sm-light-e1731699899945.png';

let emailInfoDev: EmailInfo = {
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


// render email HTML from EJS template using the emailInfo object
export const renderHTML = async (emailInfo: EmailInfo, filePath: String) => {

    let { name, email, tourTitle, vouchers, startingLocation } = emailInfo;
    startingLocation = startingLocation || 'your first distillery';

    try {
        // render the HTML from the EJS template
        const html = await renderFile(`${filePath}`, {
            name,
            email,
            tourTitle,
            vouchers,
            startingLocation,
            imgSrc,
        });
        console.log('HTML rendered successfully:\n\n');
        return html;
    } catch (error) {
        console.error('Error rendering HTML:', error);
        throw error;
    }
};



// email the customer their voucher codes + instructions
export const emailCustomerCodes = async (emailInfo: EmailInfo) => {

    try {
        console.log('starting emailCustomerCodes...');
        // render the HTML from the EJS template
        const html = await renderHTML(emailInfo, './email-templates/tmplt_confirmation.ejs');
        console.log('Codes HTML received successfully:\n\n');

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"High Proof Tours" <${process.env.HPP_EMAIL}>`,
            to: emailInfo.email,
            subject: `Your drive is about to come alive! | ${emailInfo.tourTitle}`, 
            text: 'Thanks for your purchase!', // plain text body
            html, // html body
        });

        console.log('Confirmation & Codes Message sent: %s', info.messageId);
        return {'message': `Message Codes successfully sent: ${info.messageId}`};
    } catch (error) {
        console.error('Error sending Codes email:', error);
        return {'error': `Codes Message error: ${error}`};
    }
};



// send email to customer when we didn't find all of their vouchers
export const emailCustomerPending = async (emailInfo: EmailInfo) => {
    try {
        console.log('starting emailCustomerPending...');
        // render the HTML from the EJS template
        const html = await renderHTML(emailInfo, './email-templates/tmplt_pending.ejs');
        console.log('Pending HTML received successfully:\n\n');

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"High Proof Tours" <${process.env.HPP_EMAIL}>`,
            to: emailInfo.email,
            subject: `Your drive is about to come alive! | ${emailInfo.tourTitle}`, 
            text: 'Thanks for your purchase!', // plain text body
            html, // html body
        });

        console.log('Pending Message sent: %s', info.messageId);
        return {'message': `Message Pending successfully sent: ${info.messageId}`};
    } catch (error) {
        console.error('Error sending Pending email:', error);
        return {'error': `Pending Message error: ${error}`};
    }
};


// send email to adminstrator when there's an issue
export const emailAdmin = async (alertInfo: any) => {

    let devMsg = process.env.IS_DEV ? '(dev)' : '!!';

    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"High Proof Tours" <${process.env.HPP_EMAIL}>`,
            to: 'christopher@highproofproductions.com',
            subject: `${devMsg} Stripe/Voucher Issue ${devMsg}  ${alertInfo.subject}`, 
            text: JSON.stringify(alertInfo, null, 2), // plain text body
        });

        console.log('Admin message sent: %s', info.messageId);
        return {'message': `Admin message successfully sent: ${info.messageId}`};
    } catch (error) {
        console.error('Error sending admin email:', error);
        return {'error': `Admin Message error: ${error}`};
    }
};





// if (process.env.IS_DEV == 'true') emailCustomerCodes(emailInfoDev);