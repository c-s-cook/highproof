// *** OLD ***  
// -- now working in dynamo.js for express integration
//
//


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";


const client = new DynamoDBClient({
  credentials: fromEnv(),
  region: "us-east-2"
});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
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



export const addTour = async () => {
  const command = new PutCommand({
    TableName: "TOURS2",
    Item: {
      TOUR_REGION: "KBT",
      TOUR: 2,
      TITLES: ["Birth to Boom Driving Tour - Single Day"],
    },
  });

  const response = await docClient.send(command);
  console.log("it added");
  console.log(response);
  return response;
};







export const getTours = async () => {
  const command = new QueryCommand({
    TableName: "TOURS2",
    KeyConditionExpression: "TOUR_REGION = :reg",
    ExpressionAttributeValues: {
      ":reg": "KBT"
    }
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}




export const scanTours = async () => {
  const command = new ScanCommand({
    TableName: "TOURS2"
  });

  const response = await docClient.send(command);
  console.log("tried scanning...");
  console.log(response.Items);
  return response;
}


getTours();