// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
let clientDynamodb = require('@aws-sdk/client-dynamodb');
let DynamoDBClient = clientDynamodb.DynamoDBClient;
// import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
let libDynamodb = require('@aws-sdk/lib-dynamodb');
let { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } = libDynamodb;
// import { fromEnv } from "@aws-sdk/credential-providers";
let credentialProviders = require('@aws-sdk/credential-providers');
let fromEnv = credentialProviders.fromEnv;
let dotenv = require('dotenv');
dotenv.config();
let isDev = process.env.IS_DEV == 'true' ? true : false;
// DYNAMODB TOUR TABLE NAMES
let toursTable = isDev ? "TOURS_DEV" : "TOURS";
let voucherTable = isDev ? "VM_VOUCHER_CODES_DEV" : "VM_VOUCHER_CODES";
let customerTable = isDev ? "CUSTOMERS_DEV" : "CUSTOMERS";
let transactionTable = isDev ? "TRANSACTIONS_DEV" : "TRANSACTIONS";
const client = new DynamoDBClient({
    credentials: fromEnv(),
    region: "us-east-2"
});
const docClient = DynamoDBDocumentClient.from(client);
// ****************
//  TOUR MANAGEMENT
// ****************
const createTour = async (tourRegion, tourNumber, titles, published) => {
    console.log("in dynamo.ts createTour()...");
    console.log(tourRegion, typeof tourRegion, tourNumber, typeof tourNumber, titles);
    const command = new PutCommand({
        TableName: toursTable,
        Item: {
            TOUR_REGION: tourRegion, // e.g., "KBT" for Kentucky Bourbon Tour. Maybe, someday, NAPA for Napa Valley Tour, etc.
            TOUR_NUM: tourNumber,
            TITLES: titles, // Array of titles for the tour. The current, "Active Title" should always be first / [0]
            VM_PUBLISHED: published, // has the tour been "Published" on VoiceMap? If so the "Title" can change, 
            // but the URL-string will be locked at time of publishing, so that will not need to be updated
        },
    });
    const response = await docClient.send(command);
    console.log("it added");
    console.log(response);
    return response;
};
// Update a tour's TITLES in db...
const updateTour = async (tourRegion, tourNumber, titles) => {
    const command = new UpdateCommand({
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
    try {
        const response = await docClient.send(command);
        console.log("Tour updated successfully");
        console.log(response);
        return response;
    }
    catch (error) {
        console.error("Error updating tour:", error);
        throw error;
    }
};
const getTours = async (tourRegion = "KBT") => {
    const command = new QueryCommand({
        TableName: toursTable,
        KeyConditionExpression: "TOUR_REGION = :reg",
        ExpressionAttributeValues: {
            ":reg": tourRegion
        }
    });
    const response = await docClient.send(command);
    // console.log(response);
    return response;
};
const scanTours = async () => {
    const command = new ScanCommand({
        TableName: toursTable
    });
    const response = await docClient.send(command);
    console.log("tried scanning...");
    console.log(response.Items);
    return response;
};
// *******************
//  VOUCHER MANAGEMENT
// *******************
// Create a new voucher in the VM_VOUCHER_CODES table...
const createVoucher = async (voucher) => {
    const command = new PutCommand({
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
    try {
        const response = await docClient.send(command);
        console.log("Voucher created successfully");
        // console.log(response);
        return response;
    }
    catch (error) {
        console.error("Error creating voucher:", error);
        throw error;
    }
};
// Retreive vouchers by TOUR_NUM that are AVAILABLE...
const getVouchersByTour = async (tourNum) => {
    const command = new QueryCommand({
        TableName: voucherTable,
        IndexName: "TourNumIndex", // Assuming there's a GSI on TOUR_NUM
        KeyConditionExpression: "TOUR_NUM = :tourNum AND AVAILABLE = :available",
        ExpressionAttributeValues: {
            ":tourNum": tourNum,
            ":available": true,
        },
    });
    try {
        const response = await docClient.send(command);
        console.log("Vouchers retrieved successfully");
        console.log(response.Items);
        return response.Items;
    }
    catch (error) {
        console.error("Error retrieving vouchers:", error);
        throw error;
    }
};
// retreive a single voucher by VOUCHER_ID...
const getVoucherById = async (voucherId) => {
    const command = new GetCommand({
        TableName: voucherTable,
        Key: {
            VOUCHER_ID: voucherId
        }
    });
    try {
        const response = await docClient.send(command);
        if (response.Item) {
            console.log("Voucher retrieved successfully");
            console.log("from dynamo.ts - ", response.Item);
            return response.Item;
        }
        else {
            console.log("Voucher not found");
            // return null;
            throw new Error;
        }
    }
    catch (error) {
        console.error("Error retrieving voucher:", error);
        throw error;
    }
};
// retreive most recently added voucher, which should be a voucher with the largest CREATED value in the VM_VOUCHER_TABLE. Query using a GSI on CREATED titled "CreatedIndex"...
const getMostRecentVoucher = async () => {
    /*
    * *************DOESN'T WORK*************
    *
    * the ScanCommand doesn't seem to work. It doesn't
    * return the most recent voucher. It returns a random
    * voucher.
    *
    * When trying to use a QueryCommand, with a >= or any
    * ranged operator I get the error: "Query key condition not supported"
    *
    *
    */
    // console.log("voucherTable = ", voucherTable);
    // const command = new ScanCommand({
    //     TableName: voucherTable,
    //     IndexName: "CreatedIndex",
    //     ScanIndexForward: false,  // This sorts in descending order (newest first)
    //     Limit: 1  // This gets only the first (newest) item 
    // });
    // 
    // const command = new QueryCommand({
    //     TableName: voucherTable,
    //     IndexName: "CreatedIndex",
    //     KeyConditionExpression: "CREATED >= :minValue",
    //     ExpressionAttributeValues: {
    //         ":minValue": 0  // This will match all CREATED values
    //     },
    //     ScanIndexForward: false,  // This sorts in descending order (newest first)
    //     Limit: 1  // This gets only the first (newest) item
    // });
    // a DynamoDBDocumentClient QueryCommand to find the voucher with VOUCHER_ID of "0000_MOST_RECENT"
    const command = new QueryCommand({
        TableName: voucherTable,
        KeyConditionExpression: "VOUCHER_ID = :voucherId",
        ExpressionAttributeValues: {
            ":voucherId": "0000_MOST_RECENT"
        }
    });
    try {
        const response = await docClient.send(command);
        if (response.Items && response.Items.length > 0) {
            console.log("Most recent voucher retrieved successfully");
            // console.log(response);
            console.log(response.Items[0]);
            return response.Items[0];
        }
        else {
            console.log("No vouchers found");
            return null;
        }
    }
    catch (error) {
        console.error("Error retrieving most recent voucher:", error);
        throw error;
    }
};
// this function updates the CREATED value of the 0000_MOST_RECENT voucher in the VM_VOUCHER_CODES table...
const updateMostRecentVoucher = async (newCreatedValue) => {
    console.log("in dynamo.js updateMostRecentVoucher()...");
    newCreatedValue = Number(newCreatedValue);
    if (isNaN(newCreatedValue)) {
        console.error("Invalid/NaN newCreatedValue:", newCreatedValue);
        throw new Error("Not a valid number");
    }
    const command = new UpdateCommand({
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
    try {
        const response = await docClient.send(command);
        console.log("0000_MOST_RECENT voucher CREATED updated successfully");
        // console.log(response);
        return response;
    }
    catch (error) {
        console.error("Error updating 0000_MOST_RECENT voucher:", error);
        throw error;
    }
};
// this function updates a voucher's LINK field in the VM_VOUCHER_CODES table...
const updateVoucherLink = async (voucherId, newLink) => {
    const command = new UpdateCommand({
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
    try {
        const response = await docClient.send(command);
        console.log("Voucher link updated successfully");
        console.log(response);
        return response;
    }
    catch (error) {
        console.error("Error updating voucher link:", error);
        throw error;
    }
};
module.exports = {
    createTour,
    scanTours,
    getTours,
    updateTour,
    createVoucher,
    getVouchersByTour,
    getVoucherById,
    getMostRecentVoucher,
    updateMostRecentVoucher,
    updateVoucherLink
};
//# sourceMappingURL=dynamo.js.map