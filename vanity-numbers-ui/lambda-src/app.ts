import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

import { DynamoDB } from "aws-sdk";

// The dynamoDb table name
const tableName: string = "VanityNumbers";

// DynamoDB client for storing results
const dynamo: DynamoDB.DocumentClient = new DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
    region: "us-east-1"
});

// Lambda handler for vanity numbers function
export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials' : true,
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        body: JSON.stringify(await getNumberResults())
    }
    
}

// Get the results from DynamoDB
async function getNumberResults(): Promise<DynamoDB.DocumentClient.ScanOutput> {
    const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: tableName,
        Limit: 5
    };

    return await dynamo.scan(params).promise();

}
