"use strict";
/*
* @file --- Order confirmation API ---
* @description --- This file contains the order confirmation API for the Stripe payment system.
*/
// import 'dotenv.config';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// let isDev = process.env.IS_DEV == 'true' ? true : false;
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);
const allowedOrigins = [
    'https://dev.highproofproductions.com',
    'https://highproofproductions.com',
    'https://www.highproofproductions.com',
    'https://highprooftours.com',
    'https://www.highprooftours.com',
];
export const handler = async (event) => {
    // read the origin header of the incoming lambda request
    const headers = event.headers || {};
    // Node/ApiGateway lower-cases header names; check common variants and proxies
    const origin = headers.origin || headers.Origin || headers.referer || headers.Referer || headers['x-forwarded-host'] || headers['host'] || event.requestContext?.domainName || event.requestContext?.domain;
    console.log(`Origin = ${origin}`);
    let transactionTable = "TRANSACTIONS";
    if (origin.includes('dev.highproofproductions'))
        transactionTable = "TRANSACTIONS_DEV";
    else if (!allowedOrigins.includes(origin)) {
        console.log(`Don't know this origin -> ${origin}`);
        throw new Error(`Don't know this origin -> ${origin}`);
    }
    const CORSHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
    };
    try {
        const transactionId = event.queryStringParameters?.TRANSACTION_ID;
        if (!transactionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "TRANSACTION_ID is required" }),
            };
        }
        // Fetch the Transaction object
        const transactionResult = await docClient.send(new GetCommand({
            TableName: transactionTable,
            Key: {
                TRANSACTION_ID: transactionId,
            },
        }));
        if (!transactionResult.Item) {
            return {
                statusCode: 404,
                headers: CORSHeaders,
                body: JSON.stringify({ error: "Transaction not found" }),
            };
        }
        return {
            statusCode: 200,
            headers: CORSHeaders,
            body: JSON.stringify(transactionResult.Item),
        };
    }
    catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            headers: CORSHeaders,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
//# sourceMappingURL=index.mjs.map