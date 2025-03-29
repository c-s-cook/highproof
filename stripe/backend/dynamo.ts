// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
let clientDynamodb = require('@aws-sdk/client-dynamodb');
let DynamoDBClient = clientDynamodb.DynamoDBClient;


// import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
let libDynamodb = require('@aws-sdk/lib-dynamodb');
let { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } = libDynamodb;


// import { fromEnv } from "@aws-sdk/credential-providers";
let credentialProviders = require('@aws-sdk/credential-providers');
let fromEnv = credentialProviders.fromEnv;

interface Tour {
    TOUR_REGION: string;
    TOUR: number;
    TITLES: string[];
}

interface Voucher {
    VOUCHER_ID: string;
    TOUR_NUM: number;
    LINK: string;
    CREATED: Date;
    AVAILABLE: Boolean;
    REDEEMED: Boolean;
    PURCHASED?: Date;
    TRANSACTION_ID?: string; // Foreign Key to Transactions Table
}



const client = new DynamoDBClient({
    credentials: fromEnv(),
    region: "us-east-2"
});
const docClient = DynamoDBDocumentClient.from(client);



const main = async () => {
    const command = new PutCommand({
        TableName: "TOURS",
        Item: {
            TOUR_ID: "Test5",
            TOUR: "KBT002",
            TITLES: ["Bourbon Tour Day 1 of 1", "The Bourbon Tour", "The Kentucky Bourbon Tour"],
        },
    });

    const response = await docClient.send(command);
    console.log("it ran");
    console.log(response);
    return response;
};



// ****************
//  TOUR MANAGEMENT
// ****************


const createTour = async (tourRegion: string, tourNumber: number, titles: string[]) => {
    const command = new PutCommand({
        TableName: "TOURS2",
        Item: {
            TOUR_REGION: tourRegion, // e.g., "KBT" for Kentucky Bourbon Tour. Maybe, someday, NAPA for Napa Valley Tour, etc.
            TOUR: tourNumber, 
            TITLES: titles, // Array of titles for the tour. The current, "Active Title" should always be first / [0]
        },
    });

    const response = await docClient.send(command);
    console.log("it added");
    console.log(response);
    return response;
};


// Update a tour's TITLES in db...
const updateTour = async (tourRegion: string, tourNumber: number, titles: string[]) => {
    const command = new UpdateCommand({
        TableName: "TOURS2",
        Key: {
            TOUR_REGION: tourRegion,
            TOUR: tourNumber,
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
    } catch (error) {
        console.error("Error updating tour:", error);
        throw error;
    }
};




const getTours = async (tourRegion: string = "KBT") => {
    const command = new QueryCommand({
        TableName: "TOURS2",
        KeyConditionExpression: "TOUR_REGION = :reg",
        ExpressionAttributeValues: {
            ":reg": tourRegion
        }
    });

    const response = await docClient.send(command);
    // console.log(response);
    return response;
}


const scanTours = async () => {
    const command = new ScanCommand({
        TableName: "TOURS2"
    });

    const response = await docClient.send(command);
    console.log("tried scanning...");
    console.log(response.Items);
    return response;
}


// *******************
//  VOUCHER MANAGEMENT
// *******************

// Create a new voucher in the VM_VOUCHER_CODES table...
const createVoucher = async (voucher: Voucher) => {
    const command = new PutCommand({
        TableName: "VM_VOUCHER_CODES",
        Item: {
            VOUCHER_ID: voucher.VOUCHER_ID,
            TOUR_NUM: voucher.TOUR_NUM,
            LINK: voucher.LINK,
            CREATED: voucher.CREATED.toISOString(),
            AVAILABLE: voucher.AVAILABLE, // updated when purchased
            REDEEMED: voucher.REDEEMED,
            PURCHASED: voucher.PURCHASED ? voucher.PURCHASED.toISOString() : null, // null when first created, updated when purchased
            TRANSACTION_ID: voucher.TRANSACTION_ID || null, // null when first created, updated when purchased
        },
    });

    try {
        const response = await docClient.send(command);
        console.log("Voucher created successfully");
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error creating voucher:", error);
        throw error;
    }
};

// Retreive vouchers by TOUR_NUM that are AVAILABLE...
const getVouchersByTour = async (tourNum: number) => {
    const command = new QueryCommand({
        TableName: "VM_VOUCHER_CODES",
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
    } catch (error) {
        console.error("Error retrieving vouchers:", error);
        throw error;
    }
};


// retreive a single voucher by VOUCHER_ID...
const getVoucherById = async (voucherId: string) => {
    const command = new GetCommand({
        TableName: "VM_VOUCHER_CODES",
        Key: {
            VOUCHER_ID: voucherId
        }
    });

    try {
        const response = await docClient.send(command);
        if (response.Item) {
            console.log("Voucher retrieved successfully");
            console.log(response.Item);
            return response.Item;
        } else {
            console.log("Voucher not found");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving voucher:", error);
        throw error;
    }
}

// retreive most recently added voucher...
const getMostRecentVoucher = async () => {
    const command = new ScanCommand({
        TableName: "VM_VOUCHER_CODES",
        Limit: 1, // Limit to the most recent one
        ScanIndexForward: false // Sort in descending order (if using a sort key)
    });

    try {
        const response = await docClient.send(command);
        if (response.Items && response.Items.length > 0) {
            console.log("Most recent voucher retrieved successfully");
            console.log(response.Items[0]);
            return response.Items[0];
        } else {
            console.log("No vouchers found");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving most recent voucher:", error);
        throw error;
    }
}

// this function updates a voucher's LINK field in the VM_VOUCHER_CODES table...
const updateVoucherLink = async (voucherId: string, newLink: string) => {
    const command = new UpdateCommand({
        TableName: "VM_VOUCHER_CODES",
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
    } catch (error) {
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
    updateVoucherLink
};