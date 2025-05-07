var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { renderFile } from 'ejs';
import { createTransport } from 'nodemailer';
import 'dotenv/config';
var imgSrc = 'https://highproofproductions.com/wp-content/uploads/2024/08/high-proof-productions-text-logo-sm-light-e1731699899945.png';
var emailInfoDev = {
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
var transporter = createTransport({
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
export var renderHTML = function (emailInfo, filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var name, email, tourTitle, vouchers, startingLocation, html, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = emailInfo.name, email = emailInfo.email, tourTitle = emailInfo.tourTitle, vouchers = emailInfo.vouchers, startingLocation = emailInfo.startingLocation;
                startingLocation = startingLocation || 'your first distillery';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, renderFile("".concat(filePath), {
                        name: name,
                        email: email,
                        tourTitle: tourTitle,
                        vouchers: vouchers,
                        startingLocation: startingLocation,
                        imgSrc: imgSrc,
                    })];
            case 2:
                html = _a.sent();
                console.log('HTML rendered successfully:\n\n');
                return [2 /*return*/, html];
            case 3:
                error_1 = _a.sent();
                console.error('Error rendering HTML:', error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
// email the customer their voucher codes + instructions
export var emailCustomerCodes = function (emailInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var html, info, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, renderHTML(emailInfo, './email-templates/tmplt_confirmation.ejs')];
            case 1:
                html = _a.sent();
                return [4 /*yield*/, transporter.sendMail({
                        from: "\"High Proof Tours\" <".concat(process.env.HPP_EMAIL, ">"),
                        to: emailInfo.email,
                        subject: "Your drive is about to come alive! | ".concat(emailInfo.tourTitle),
                        text: 'Thanks for your purchase!', // plain text body
                        html: html,
                    })];
            case 2:
                info = _a.sent();
                console.log('Confirmation & Codes Message sent: %s', info.messageId);
                return [2 /*return*/, { 'message': "Message Codes successfully sent: ".concat(info.messageId) }];
            case 3:
                error_2 = _a.sent();
                console.error('Error sending Codes email:', error_2);
                return [2 /*return*/, { 'error': "Codes Message error: ".concat(error_2) }];
            case 4: return [2 /*return*/];
        }
    });
}); };
// send email to customer when we didn't find all of their vouchers
export var emailCustomerPending = function (emailInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var html, info, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, renderHTML(emailInfo, './email-templates/tmplt_pending.ejs')];
            case 1:
                html = _a.sent();
                return [4 /*yield*/, transporter.sendMail({
                        from: "\"High Proof Tours\" <".concat(process.env.HPP_EMAIL, ">"),
                        to: emailInfo.email,
                        subject: "Your drive is about to come alive! | ".concat(emailInfo.tourTitle),
                        text: 'Thanks for your purchase!', // plain text body
                        html: html,
                    })];
            case 2:
                info = _a.sent();
                console.log('Pending Message sent: %s', info.messageId);
                return [2 /*return*/, { 'message': "Message Pending successfully sent: ".concat(info.messageId) }];
            case 3:
                error_3 = _a.sent();
                console.error('Error sending Pending email:', error_3);
                return [2 /*return*/, { 'error': "Pending Message error: ".concat(error_3) }];
            case 4: return [2 /*return*/];
        }
    });
}); };
// send email to adminstrator when there's an issue
export var emailAdmin = function (alertInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var info, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, transporter.sendMail({
                        from: "\"High Proof Tours\" <".concat(process.env.HPP_EMAIL, ">"),
                        to: 'christopher@highproofproductions.com',
                        subject: "!! Stripe/Voucher Issue !!  ".concat(alertInfo.subject),
                        text: JSON.stringify(alertInfo, null, 2), // plain text body
                    })];
            case 1:
                info = _a.sent();
                console.log('Admin message sent: %s', info.messageId);
                return [2 /*return*/, { 'message': "Admin message successfully sent: ".concat(info.messageId) }];
            case 2:
                error_4 = _a.sent();
                console.error('Error sending admin email:', error_4);
                return [2 /*return*/, { 'error': "Admin Message error: ".concat(error_4) }];
            case 3: return [2 /*return*/];
        }
    });
}); };
// if (process.env.IS_DEV == 'true') emailCustomerCodes(emailInfoDev);
