//  Module for Stipe Lambda end-point to access DynamoDB tables

import 'dotenv/config';

import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
// let clientDynamodb = require('@aws-sdk/client-dynamodb');
// let DynamoDBClient = clientDynamodb.DynamoDBClient;


import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
// let libDynamodb = require('@aws-sdk/lib-dynamodb');
// let { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } = libDynamodb;


import { fromEnv } from "@aws-sdk/credential-providers";
// let credentialProviders = require('@aws-sdk/credential-providers');
// let fromEnv = credentialProviders.fromEnv;


const client = new DynamoDBClient({
    credentials: fromEnv(),
    region: "us-east-2"
});
const docClient = DynamoDBDocumentClient.from(client);


let isDev = process.env.IS_DEV == 'true' ? true : false;

// DYNAMODB TOUR TABLE NAMES
let toursTable = isDev ? "TOURS_DEV" : "TOURS";
let voucherTable = isDev ? "VM_VOUCHER_CODES_DEV" : "VM_VOUCHER_CODES"
let customerTable = isDev ? "CUSTOMERS_DEV" : "CUSTOMERS"
let transactionTable = isDev ? "TRANSACTIONS_DEV" : "TRANSACTIONS"


interface Tour {
    TOUR_REGION: string;
    TOUR_NUM: number;
    TITLES: string[];
}

interface Voucher {
    VOUCHER_ID: string;
    TOUR_NUM: number;
    LINK: string;
    CREATED: number;        // new Date().valueOf() == ms as number
    AVAILABLE: Boolean;
    REDEEMED: Boolean;
    PURCHASED?: number;     // new Date().valueOf() == ms as number
    TRANSACTION_ID?: string; // Foreign Key to Transactions Table
}

interface VoucherResult {
    voucher: Voucher;
    count: number | undefined;
    scannedCount: number | undefined;
    attempts: number;
}

interface Address {
    city: string;
    country: string;
    line1: string;
    line2?: string;
    postal_code: string;
    state: string;
}

interface Customer {
    CUSTOMER: string;       //  their email
    NAME: string;
    ADDRESS: Address;
    TRANSACTIONS: string[];
}

interface Transaction {
    TRANSACTION_ID: string;     // the Checkout.session ID
    CUSTOMER: string;           // their email | Foreign Key to CUSTOMERS table
    VOUCHERS: string[];         // list of VOUCHER_ID strings
    DATE: number;               // new Date().valueOf() == ms as number
}



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
export async function getTourVoucher(tourNum: number): Promise<VoucherResult> {
    
    const params: {
        TableName: string;
        IndexName: string;
        KeyConditionExpression: string;
        FilterExpression: string;
        ExpressionAttributeValues: { ":tourNum": number; ":available": boolean };
        Limit: number;
        ExclusiveStartKey?: Record<string, any>;
    } = {
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

    const runQueryCommand = async () => {
        try {
            const command = new QueryCommand(params);
            const result = await docClient.send(command);
            return result;

        } catch (error) {
            console.error("Error retrieving voucher:", error);
            throw error;
        }
    }

    let voucher: Voucher | null = null;
    let attempts = 1;
    let voucherResult: VoucherResult | null = null;
    
    while (!voucher) {
        console.log("attempt #", attempts);
        attempts++;
        const result = await runQueryCommand();
        console.log('getTourVouchers results = ', result);

        if (result.Items && result.Items.length > 0) {
            voucher = result.Items[0] as Voucher;
            voucherResult = {
                voucher: voucher,
                count: result.Count,
                scannedCount: result.ScannedCount,
                attempts: attempts
            }
            console.log("dynamo voucher result = ", voucher);
            break; // Exit the loop if a voucher is found
            
        } else if (result.LastEvaluatedKey) {
            params.ExclusiveStartKey = result.LastEvaluatedKey; // Set the start key for the next query
        } else {
            throw new Error(`No available vouchers found for tour number ${tourNum}.`);
        }
    }
    return voucherResult as VoucherResult;
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
export async function updateVoucher(voucherId: string, transactionID: string, purchased: number): Promise<string> {
    try {
        const params = {
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
            ReturnValues: "UPDATED_NEW" as const
        };

        const command = new UpdateCommand(params);
        await docClient.send(command);

        return `Voucher ${voucherId} successfully updated.`;
    } catch (error) {
        console.error("Error updating voucher:", error);
        throw new Error(`Failed to update voucher ${voucherId}: ${error}`);
    }
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
export async function findCustomer(email: string): Promise<Customer | null> {
    try {
        const params = {
            TableName: customerTable,
            Key: { CUSTOMER: email }
        };

        const command = new GetCommand(params);
        const result = await docClient.send(command);

        if (result.Item) {
            return result.Item as Customer;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error finding customer:", error);
        throw new Error(`Failed to find customer with email ${email}: ${error}`);
    }
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
export async function updateCustomer(email: string, transactionID: string, name?: string, address?: Address): Promise<string> {
    try {
        const updateExpressions: string[] = [];
        const expressionAttributeValues: Record<string, any> = {};
        const expressionAttributeNames: Record<string, string> = {};

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

        const params = {
            TableName: customerTable,
            Key: { CUSTOMER: email },
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: "UPDATED_NEW" as const
        };

        const command = new UpdateCommand(params);
        const result = await docClient.send(command);

        return `Customer ${email} successfully updated: ${JSON.stringify(result.Attributes)}`;
    } catch (error) {
        console.error("Error updating customer:", error);
        throw new Error(`Failed to update customer ${email}: ${error}`);
    }
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
export async function createCustomer(email: string, transactionID: string, name: string, address: Address): Promise<string> {
    try {
        const params = {
            TableName: customerTable,
            Item: {
                CUSTOMER: email,
                NAME: name,
                ADDRESS: address,
                TRANSACTIONS: [transactionID]
            },
            ConditionExpression: "attribute_not_exists(CUSTOMER)"
        };

        const command = new PutCommand(params);
        let result = await docClient.send(command);

        return `Customer ${email} successfully created.`;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw new Error(`Failed to create customer ${email}: ${error}`);
    }
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
export async function recordTransaction(transactionID: string, customer: string, date: number, vouchers: string[]): Promise<string> {
    try {
        const params = {
            TableName: transactionTable,
            Item: {
                TRANSACTION_ID: transactionID,
                CUSTOMER: customer,
                DATE: date,
                VOUCHERS: vouchers
            },
            ConditionExpression: "attribute_not_exists(TRANSACTION_ID)"
        };

        const command = new PutCommand(params);
        await docClient.send(command);

        return `Transaction ${transactionID} successfully recorded.`;
    } catch (error) {
        console.error("Error recording transaction:", error);
        throw new Error(`Failed to record transaction ${transactionID}: ${error}`);
    }
}

