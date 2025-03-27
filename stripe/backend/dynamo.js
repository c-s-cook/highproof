// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
let clientDynamodb = require('@aws-sdk/client-dynamodb');
let DynamoDBClient = clientDynamodb.DynamoDBClient;


// import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
let libDynamodb = require('@aws-sdk/lib-dynamodb');
let { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand } = libDynamodb;


// import { fromEnv } from "@aws-sdk/credential-providers";
let credentialProviders = require('@aws-sdk/credential-providers');
let fromEnv = credentialProviders.fromEnv;


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



const addTour = async () => {
    const command = new PutCommand({
        TableName: "TOURS2",
        Item: {
            TOUR_REGION: "KBT",
            TOUR: 5,
            TITLES: ["Kentucky Bourbon Tour Day 2 | Heaven Hill, Four Roses, Woodford", "Kentucky Bourbon: Birth to Boom (Day 2/2) | From Heaven Hill"],
        },
    });

    const response = await docClient.send(command);
    console.log("it added");
    console.log(response);
    return response;
};







const getTours = async () => {
    const command = new QueryCommand({
        TableName: "TOURS2",
        KeyConditionExpression: "TOUR_REGION = :reg",
        ExpressionAttributeValues: {
            ":reg": "KBT"
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


// addTour();

module.exports = {addTour, scanTours, getTours}