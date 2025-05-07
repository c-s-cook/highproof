/*
* @file --- Order confirmation API ---
* @description --- This file contains the order confirmation API for the Stripe payment system.
*/


import 'dotenv.config';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";



interface Transaction {
    TRANSACTION_ID: string;     // the Checkout.session ID
    CUSTOMER: string;           // their email | Foreign Key to CUSTOMERS table
    NAME: string;              // their name
    VOUCHERS: string[];         // list of VOUCHER_ID strings
    TOUR_NUMS: number[];         // list of TOUR_NUMs 
    TOUR_TITLE: string;        // the tour title  
    DATE: number;               // new Date().valueOf() == ms as number
}


let isDev = process.env.IS_DEV == 'true' ? true : false;

// DYNAMODB TOUR TABLE NAMES
// let toursTable = isDev ? "TOURS_DEV" : "TOURS";
// let voucherTable = isDev ? "VM_VOUCHER_CODES_DEV" : "VM_VOUCHER_CODES"
// let customerTable = isDev ? "CUSTOMERS_DEV" : "CUSTOMERS"
let transactionTable = isDev ? "TRANSACTIONS_DEV" : "TRANSACTIONS"



const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);


export const handler = async (event: any) => {
    try {
        const transactionId = event.queryStringParameters?.TRANSACTION_ID;
        if (!transactionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "TRANSACTION_ID is required" }),
            };
        }

        // Fetch the Transaction object
        const transactionResult = await docClient.send(
            new GetCommand({
            TableName: transactionTable,
            Key: {
                TRANSACTION_ID: transactionId,
            },
            })
        );

        if (!transactionResult.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Transaction not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(transactionResult.Item),
        };
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};