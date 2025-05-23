"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
var clientDynamodb = require('@aws-sdk/client-dynamodb');
var DynamoDBClient = clientDynamodb.DynamoDBClient;
// import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
var libDynamodb = require('@aws-sdk/lib-dynamodb');
var PutCommand = libDynamodb.PutCommand, GetCommand = libDynamodb.GetCommand, QueryCommand = libDynamodb.QueryCommand, DynamoDBDocumentClient = libDynamodb.DynamoDBDocumentClient, ScanCommand = libDynamodb.ScanCommand, UpdateCommand = libDynamodb.UpdateCommand;
// import { fromEnv } from "@aws-sdk/credential-providers";
var credentialProviders = require('@aws-sdk/credential-providers');
var fromEnv = credentialProviders.fromEnv;
var dotenv = require('dotenv');
dotenv.config();
var isDev = process.env.IS_DEV == 'true' ? true : false;
// DYNAMODB TOUR TABLE NAMES
var toursTable = isDev ? "TOURS_DEV" : "TOURS";
var voucherTable = isDev ? "VM_VOUCHER_CODES_DEV" : "VM_VOUCHER_CODES";
var customerTable = isDev ? "CUSTOMERS_DEV" : "CUSTOMERS";
var transactionTable = isDev ? "TRANSACTIONS_DEV" : "TRANSACTIONS";
var client = new DynamoDBClient({
    credentials: fromEnv(),
    region: "us-east-2"
});
var docClient = DynamoDBDocumentClient.from(client);
// ****************
//  TOUR MANAGEMENT
// ****************
var createTour = function (tourRegion, tourNumber, titles, published) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("in dynamo.ts createTour()...");
                console.log(tourRegion, typeof tourRegion, tourNumber, typeof tourNumber, titles);
                command = new PutCommand({
                    TableName: toursTable,
                    Item: {
                        TOUR_REGION: tourRegion, // e.g., "KBT" for Kentucky Bourbon Tour. Maybe, someday, NAPA for Napa Valley Tour, etc.
                        TOUR_NUM: tourNumber,
                        TITLES: titles, // Array of titles for the tour. The current, "Active Title" should always be first / [0]
                        VM_PUBLISHED: published, // has the tour been "Published" on VoiceMap? If so the "Title" can change, 
                        // but the URL-string will be locked at time of publishing, so that will not need to be updated
                    },
                });
                return [4 /*yield*/, docClient.send(command)];
            case 1:
                response = _a.sent();
                console.log("it added");
                console.log(response);
                return [2 /*return*/, response];
        }
    });
}); };
// Update a tour's TITLES in db...
var updateTour = function (tourRegion, tourNumber, titles) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new UpdateCommand({
                    TableName: toursTable,
                    Key: {
                        TOUR_REGION: tourRegion,
                        TOUR_NUM: tourNumber,
                    },
                    UpdateExpression: "SET TITLES = :titles",
                    ExpressionAttributeValues: {
                        ":titles": titles,
                    },
                    ReturnValues: "ALL_NEW", // Returns the updated item
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                console.log("Tour updated successfully");
                console.log(response);
                return [2 /*return*/, response];
            case 3:
                error_1 = _a.sent();
                console.error("Error updating tour:", error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
var getTours = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (tourRegion) {
        var command, response;
        if (tourRegion === void 0) { tourRegion = "KBT"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new QueryCommand({
                        TableName: toursTable,
                        KeyConditionExpression: "TOUR_REGION = :reg",
                        ExpressionAttributeValues: {
                            ":reg": tourRegion
                        }
                    });
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    response = _a.sent();
                    // console.log(response);
                    return [2 /*return*/, response];
            }
        });
    });
};
var scanTours = function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new ScanCommand({
                    TableName: toursTable
                });
                return [4 /*yield*/, docClient.send(command)];
            case 1:
                response = _a.sent();
                console.log("tried scanning...");
                console.log(response.Items);
                return [2 /*return*/, response];
        }
    });
}); };
// *******************
//  VOUCHER MANAGEMENT
// *******************
// Create a new voucher in the VM_VOUCHER_CODES table...
var createVoucher = function (voucher) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new PutCommand({
                    TableName: voucherTable,
                    Item: {
                        VOUCHER_ID: voucher.VOUCHER_ID,
                        TOUR_NUM: voucher.TOUR_NUM,
                        LINK: voucher.LINK,
                        CREATED: new Date(voucher.CREATED).valueOf(), //takes the string, creates Date obj, then outputs ms number
                        AVAILABLE: voucher.AVAILABLE, // updated when purchased
                        REDEEMED: voucher.REDEEMED,
                        PURCHASED: voucher.PURCHASED ? new Date(voucher.PURCHASED).valueOf() : null, // null when first created, updated when purchased
                        TRANSACTION_ID: voucher.TRANSACTION_ID || null, // null when first created, updated when purchased
                    },
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                console.log("Voucher created successfully");
                // console.log(response);
                return [2 /*return*/, response];
            case 3:
                error_2 = _a.sent();
                console.error("Error creating voucher:", error_2);
                throw error_2;
            case 4: return [2 /*return*/];
        }
    });
}); };
// Retreive vouchers by TOUR_NUM that are AVAILABLE...
var getVouchersByTour = function (tourNum) { return __awaiter(void 0, void 0, void 0, function () {
    var makeCommand, command, response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                makeCommand = function (isAvailable) {
                    return new QueryCommand({
                        TableName: voucherTable,
                        IndexName: "TourNumIndex", // Assuming there's a GSI on TOUR_NUM
                        KeyConditionExpression: "TOUR_NUM = :tourNum",
                        // FilterExpression: "AVAILABLE = :available",
                        ExpressionAttributeValues: {
                            ":tourNum": tourNum,
                            // ":available": isAvailable,
                        },
                    });
                };
                command = makeCommand(true);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                console.log("Vouchers retrieved successfully");
                // console.log(response.Items);
                console.log('\n\n\n\n');
                return [2 /*return*/, response.Items];
            case 3:
                error_3 = _a.sent();
                console.error("Error retrieving vouchers:", error_3);
                throw error_3;
            case 4: return [2 /*return*/];
        }
    });
}); };
// console.log(getVouchersByTour(1));
// retreive a single voucher by VOUCHER_ID...
var getVoucherById = function (voucherId) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new GetCommand({
                    TableName: voucherTable,
                    Key: {
                        VOUCHER_ID: voucherId
                    }
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                if (response.Item) {
                    console.log("Voucher retrieved successfully");
                    console.log("from dynamo.ts - ", response.Item);
                    return [2 /*return*/, response.Item];
                }
                else {
                    console.log("Voucher not found");
                    // return null;
                    throw new Error;
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error retrieving voucher:", error_4);
                throw error_4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// retreive most recently added voucher, which should be a voucher with the largest CREATED value in the VM_VOUCHER_TABLE. Query using a GSI on CREATED titled "CreatedIndex"...
var getMostRecentVoucher = function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new QueryCommand({
                    TableName: voucherTable,
                    KeyConditionExpression: "VOUCHER_ID = :voucherId",
                    ExpressionAttributeValues: {
                        ":voucherId": "0000_MOST_RECENT"
                    }
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                if (response.Items && response.Items.length > 0) {
                    console.log("Most recent voucher retrieved successfully");
                    // console.log(response);
                    console.log(response.Items[0]);
                    return [2 /*return*/, response.Items[0]];
                }
                else {
                    console.log("No vouchers found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error("Error retrieving most recent voucher:", error_5);
                throw error_5;
            case 4: return [2 /*return*/];
        }
    });
}); };
// this function updates the CREATED value of the 0000_MOST_RECENT voucher in the VM_VOUCHER_CODES table...
var updateMostRecentVoucher = function (newCreatedValue) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("in dynamo.js updateMostRecentVoucher()...");
                newCreatedValue = Number(newCreatedValue);
                if (isNaN(newCreatedValue)) {
                    console.error("Invalid/NaN newCreatedValue:", newCreatedValue);
                    throw new Error("Not a valid number");
                }
                command = new UpdateCommand({
                    TableName: voucherTable,
                    Key: {
                        VOUCHER_ID: "0000_MOST_RECENT",
                    },
                    UpdateExpression: "SET CREATED = :newCreatedValue",
                    ExpressionAttributeValues: {
                        ":newCreatedValue": newCreatedValue,
                    },
                    ReturnValues: "ALL_NEW", // Returns the updated item
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                console.log("0000_MOST_RECENT voucher CREATED updated successfully");
                // console.log(response);
                return [2 /*return*/, response];
            case 3:
                error_6 = _a.sent();
                console.error("Error updating 0000_MOST_RECENT voucher:", error_6);
                throw error_6;
            case 4: return [2 /*return*/];
        }
    });
}); };
// this function updates a voucher's LINK field in the VM_VOUCHER_CODES table...
var updateVoucherLink = function (voucherId, newLink) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new UpdateCommand({
                    TableName: voucherTable,
                    Key: {
                        VOUCHER_ID: voucherId,
                    },
                    UpdateExpression: "SET LINK = :newLink",
                    ExpressionAttributeValues: {
                        ":newLink": newLink,
                    },
                    ReturnValues: "ALL_NEW", // Returns the updated item
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                console.log("Voucher link updated successfully");
                console.log(response);
                return [2 /*return*/, response];
            case 3:
                error_7 = _a.sent();
                console.error("Error updating voucher link:", error_7);
                throw error_7;
            case 4: return [2 /*return*/];
        }
    });
}); };
// **********************
//  CUSTOMER MANAGEMENT
// **********************
var getCustomerById = function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new GetCommand({
                    TableName: customerTable,
                    Key: {
                        CUSTOMER: customerId
                    }
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                if (response.Item) {
                    console.log("Customer retrieved successfully");
                    console.log(response.Item);
                    return [2 /*return*/, response.Item];
                }
                else {
                    console.log("Customer not found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.error("Error retrieving customer:", error_8);
                throw error_8;
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllCustomers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new ScanCommand({
                    TableName: customerTable
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                if (response.Items) {
                    console.log("Customers retrieved successfully. Count: ", response.Count);
                    // console.log(response.Items);
                    return [2 /*return*/, response.Items];
                }
                else {
                    console.log("No customers found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                console.error("Error retrieving customers:", error_9);
                throw error_9;
            case 4: return [2 /*return*/];
        }
    });
}); };
// **********************
//  CUSTOMER MANAGEMENT
// **********************
var getTransactionById = function (transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new GetCommand({
                    TableName: transactionTable,
                    Key: {
                        TRANSACTION_ID: transactionId
                    }
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                if (response.Item) {
                    console.log("Transaction retrieved successfully");
                    console.log(response.Item);
                    return [2 /*return*/, response.Item];
                }
                else {
                    console.log("Transaction not found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                console.error("Error retrieving transaction:", error_10);
                throw error_10;
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllTransactions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, response, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new ScanCommand({
                    TableName: transactionTable
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _a.sent();
                if (response.Items) {
                    console.log("Transactions retrieved successfully. Count: ", response.Count);
                    console.log(response.Items);
                    return [2 /*return*/, response.Items];
                }
                else {
                    console.log("No transactions found");
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                console.error("Error retrieving transactions:", error_11);
                throw error_11;
            case 4: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    createTour: createTour,
    scanTours: scanTours,
    getTours: getTours,
    updateTour: updateTour,
    createVoucher: createVoucher,
    getVouchersByTour: getVouchersByTour,
    getVoucherById: getVoucherById,
    getMostRecentVoucher: getMostRecentVoucher,
    updateMostRecentVoucher: updateMostRecentVoucher,
    updateVoucherLink: updateVoucherLink,
    getCustomerById: getCustomerById,
    getAllCustomers: getAllCustomers,
    getTransactionById: getTransactionById,
    getAllTransactions: getAllTransactions,
};
