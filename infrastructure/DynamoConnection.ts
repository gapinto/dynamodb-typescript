'use strict';
import { ErrorDynamoDB } from '../domain/ErrorDynamoDB';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class DynamoConnection {

    private static documentClient: DynamoDB.DocumentClient = null;
    
    private constructor() {

    }

    public static getDocumentClient(): DynamoDB.DocumentClient {
        if (!DynamoConnection.documentClient) {
            const documentClient : DocumentClient = null;
            const dynamodbOfflineOptions = {
                region: process.env.DYNAMODB_HOST,
                endpoint: `http://${process.env.DYNAMODB_HOST}:${process.env.DYNAMODB_PORT}`,
                accessKeyId: "localAccessKey",
                secretAccessKey: "localSecretAccessKey"
            };
            
            const isOffline: boolean = process.env.IS_OFFLINE === 'true';
            if(isOffline) {
                DynamoConnection.documentClient = new DynamoDB.DocumentClient(dynamodbOfflineOptions);
            } else {
                DynamoConnection.documentClient = new DynamoDB.DocumentClient();
            }
        }
            
        return DynamoConnection.documentClient;
    }
}
