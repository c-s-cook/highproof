//  Module for Stipe Lambda end-point to access DynamoDB tables
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
import 'dotenv/config';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// let clientDynamodb = require('@aws-sdk/client-dynamodb');
// let DynamoDBClient = clientDynamodb.DynamoDBClient;
import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
// let libDynamodb = require('@aws-sdk/lib-dynamodb');
// let { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } = libDynamodb;
import { fromEnv } from "@aws-sdk/credential-providers";
// let credentialProviders = require('@aws-sdk/credential-providers');
// let fromEnv = credentialProviders.fromEnv;
var client = new DynamoDBClient({
    credentials: fromEnv(),
    region: "us-east-2"
});
var docClient = DynamoDBDocumentClient.from(client);
var isDev = process.env.IS_DEV == 'true' ? true : false;
// DYNAMODB TOUR TABLE NAMES
var toursTable = isDev ? "TOURS_DEV" : "TOURS";
var voucherTable = isDev ? "VM_VOUCHER_CODES_DEV" : "VM_VOUCHER_CODES";
var customerTable = isDev ? "CUSTOMERS_DEV" : "CUSTOMERS";
var transactionTable = isDev ? "TRANSACTIONS_DEV" : "TRANSACTIONS";
// ************************
//  VM_VOUCHER_CODES TABLE
// ************************
/**
 * @function getTourVoucher
 *
 * For retrieving a Voucher from the AWS DynamoDB voucherTable
 *
 * @param {number} tourNum - The TOUR_ID
 * @return {Promise<VoucherResult>} - The first Voucher in the returned list
 */
export function getTourVoucher(tourNum) {
    return __awaiter(this, void 0, void 0, function () {
        var params, runQueryCommand, voucher, attempts, voucherResult, result;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        TableName: voucherTable,
                        IndexName: "TourNumIndex",
                        KeyConditionExpression: "TOUR_NUM = :tourNum",
                        FilterExpression: "AVAILABLE = :available",
                        ExpressionAttributeValues: {
                            ":tourNum": tourNum,
                            ":available": true,
                        },
                        Limit: 10
                    };
                    runQueryCommand = function () { return __awaiter(_this, void 0, void 0, function () {
                        var command, result, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    command = new QueryCommand(params);
                                    return [4 /*yield*/, docClient.send(command)];
                                case 1:
                                    result = _a.sent();
                                    return [2 /*return*/, result];
                                case 2:
                                    error_1 = _a.sent();
                                    console.error("Error retrieving voucher:", error_1);
                                    throw error_1;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    voucher = null;
                    attempts = 1;
                    voucherResult = null;
                    _a.label = 1;
                case 1:
                    if (!!voucher) return [3 /*break*/, 3];
                    console.log("attempt #", attempts);
                    attempts++;
                    return [4 /*yield*/, runQueryCommand()];
                case 2:
                    result = _a.sent();
                    console.log('getTourVouchers results = ', result);
                    if (result.Items && result.Items.length > 0) {
                        voucher = result.Items[0];
                        voucherResult = {
                            voucher: voucher,
                            count: result.Count,
                            scannedCount: result.ScannedCount,
                            attempts: attempts
                        };
                        console.log("dynamo voucher result = ", voucher);
                        return [3 /*break*/, 3]; // Exit the loop if a voucher is found
                    }
                    else if (result.LastEvaluatedKey) {
                        params.ExclusiveStartKey = result.LastEvaluatedKey; // Set the start key for the next query
                    }
                    else {
                        throw new Error("No available vouchers found for tour number ".concat(tourNum, "."));
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, voucherResult];
            }
        });
    });
}
/**
 * @function updateVoucher
 *
 * Update the provided Voucher in the VM_VOUCHER_CODES DynamoDB table to mark AVAILABLE false, and add TRANSACTION_ID and PURCHASED date
 *
 * @param {string} voucherId - the ID of the voucher to update
 * @param {string} transactionID - the Checkout.session.id
 * @param {number} purchased - the timestamp of when the voucher was purchased
 * @return {Promise<string>} - success message or error message
 */
export function updateVoucher(voucherId, transactionID, purchased) {
    return __awaiter(this, void 0, void 0, function () {
        var params, command, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    params = {
                        TableName: voucherTable,
                        Key: { VOUCHER_ID: voucherId },
                        UpdateExpression: "SET AVAILABLE = :available, TRANSACTION_ID = :transactionID, PURCHASED = :purchased",
                        ExpressionAttributeValues: {
                            ":available": false,
                            ":transactionID": transactionID,
                            ":purchased": purchased
                        },
                        // ConditionExpression: "AVAILABLE = :availableCheck",
                        // ExpressionAttributeValuesCondition: {
                        //     ":availableCheck": true
                        // },
                        ReturnValues: "UPDATED_NEW"
                    };
                    command = new UpdateCommand(params);
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, "Voucher ".concat(voucherId, " successfully updated.")];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error updating voucher:", error_2);
                    throw new Error("Failed to update voucher ".concat(voucherId, ": ").concat(error_2));
                case 3: return [2 /*return*/];
            }
        });
    });
}
// *******************
//  CUSTOMERS TABLE
// *******************
/**
 * @function findCustomer
 *
 * search for a Customer in the CUSTOMERS DynamoDB table
 *
 * @param {string} email - the Primary Key for the CUSTOMERS table
 * @return {Promise<Customer | null>} - The Customer object if found, or null if not found
 */
export function findCustomer(email) {
    return __awaiter(this, void 0, void 0, function () {
        var params, command, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    params = {
                        TableName: customerTable,
                        Key: { CUSTOMER: email }
                    };
                    command = new GetCommand(params);
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    result = _a.sent();
                    if (result.Item) {
                        return [2 /*return*/, result.Item];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error finding customer:", error_3);
                    throw new Error("Failed to find customer with email ".concat(email, ": ").concat(error_3));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * @function updateCustomer
 *
 * update a Customer record in the CUSTOMERS DynamoDB table
 *
 * @param {string} email - the Primary Key for the CUSTOMERS table *
 * @param {string} transactionID - to be added to the Array/List of TRANSACTIONS
 * @param {string} [name]  -  passed if name in current purchase is different from one in DB
 * @param {Address} [address] - passed if transaction has a different address than found in DB
 */
export function updateCustomer(email, transactionID, name, address) {
    return __awaiter(this, void 0, void 0, function () {
        var updateExpressions, expressionAttributeValues, expressionAttributeNames, params, command, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    updateExpressions = [];
                    expressionAttributeValues = {};
                    expressionAttributeNames = {};
                    // Add transactionID to TRANSACTIONS array
                    updateExpressions.push("#transactions = list_append(if_not_exists(#transactions, :emptyList), :transactionID)");
                    expressionAttributeValues[":transactionID"] = [transactionID];
                    expressionAttributeValues[":emptyList"] = [];
                    expressionAttributeNames["#transactions"] = "TRANSACTIONS";
                    // Update name if provided
                    if (name) {
                        updateExpressions.push("#name = :name");
                        expressionAttributeValues[":name"] = name;
                        expressionAttributeNames["#name"] = "NAME";
                    }
                    // Update address if provided
                    if (address) {
                        updateExpressions.push("#address = :address");
                        expressionAttributeValues[":address"] = address;
                        expressionAttributeNames["#address"] = "ADDRESS";
                    }
                    console.log("updateExpressions =  SET ", updateExpressions.join(", "));
                    params = {
                        TableName: customerTable,
                        Key: { CUSTOMER: email },
                        UpdateExpression: "SET ".concat(updateExpressions.join(", ")),
                        ExpressionAttributeValues: expressionAttributeValues,
                        ExpressionAttributeNames: expressionAttributeNames,
                        ReturnValues: "UPDATED_NEW"
                    };
                    command = new UpdateCommand(params);
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, "Customer ".concat(email, " successfully updated: ").concat(JSON.stringify(result.Attributes))];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error updating customer:", error_4);
                    throw new Error("Failed to update customer ".concat(email, ": ").concat(error_4));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * @function createCustomer
 *
 * create a new Customer record in the CUSTOMERS DynamoDB table
 *
 * @param {string} email - the Primary Key for the CUSTOMERS table
 * @param {string} transactionID - the transaction ID to associate with the customer
 * @param {string} name - the name of the customer
 * @param {Address} address - the address of the customer
 * @return {Promise<string>} - success message or error message
 */
export function createCustomer(email, transactionID, name, address) {
    return __awaiter(this, void 0, void 0, function () {
        var params, command, result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    params = {
                        TableName: customerTable,
                        Item: {
                            CUSTOMER: email,
                            NAME: name,
                            ADDRESS: address,
                            TRANSACTIONS: [transactionID]
                        },
                        ConditionExpression: "attribute_not_exists(CUSTOMER)"
                    };
                    command = new PutCommand(params);
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, "Customer ".concat(email, " successfully created.")];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error creating customer:", error_5);
                    throw new Error("Failed to create customer ".concat(email, ": ").concat(error_5));
                case 3: return [2 /*return*/];
            }
        });
    });
}
// *******************
//  TRANSACTIONS TABLE
// *******************
/**
 * @function recordTransaction
 *
 * Create a new Transaction record in the TRANSACTIONS DynamoDB table
 *
 * @param {string} transactionID - The unique ID of the transaction
 * @param {string} customer - The email of the customer (Foreign Key to CUSTOMERS table)
 * @param {number} date - The timestamp of the transaction
 * @param {string[]} vouchers - Array of voucher codes sent in this transaction
 * @return {Promise<string>} - Success message or error message
 */
export function recordTransaction(transactionID, customer, name, date, vouchers, tourNums, tourTitle) {
    return __awaiter(this, void 0, void 0, function () {
        var params, command, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    params = {
                        TableName: transactionTable,
                        Item: {
                            TRANSACTION_ID: transactionID,
                            CUSTOMER: customer,
                            DATE: date,
                            VOUCHERS: vouchers,
                            NAME: name,
                            TOUR_NUMS: tourNums,
                            TOUR_TITLE: tourTitle
                        },
                        ConditionExpression: "attribute_not_exists(TRANSACTION_ID)"
                    };
                    command = new PutCommand(params);
                    return [4 /*yield*/, docClient.send(command)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, "Transaction ".concat(transactionID, " successfully recorded.")];
                case 2:
                    error_6 = _a.sent();
                    console.error("Error recording transaction:", error_6);
                    throw new Error("Failed to record transaction ".concat(transactionID, ": ").concat(error_6));
                case 3: return [2 /*return*/];
            }
        });
    });
}
