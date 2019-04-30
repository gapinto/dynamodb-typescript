import { EventEmitter } from "events";
import { DocumentClientDB } from "../infrastructure/DocumentClientDB";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ErrorDynamoDB } from "../domain/ErrorDynamoDB";
import { DynamoConnection } from "../infrastructure/DynamoConnection";

export class GetEvent extends EventEmitter {

    private static instance: GetEvent = null;
    private _tableName: string;
    private _id: {};

    private constructor(tableName: string, id: string) {
        super();
        this._tableName = tableName;
        this._id = id;
    }

    public static getInstance(tableName: string, id: string) : GetEvent {
        if (!GetEvent.instance) {
            GetEvent.instance = new GetEvent(tableName, id);
        } else {
            GetEvent.instance._tableName = tableName;
            GetEvent.instance._id = id;
        }
            
        return GetEvent.instance;
    }

    public async execute() {
        const params = {
            TableName: this._tableName,
            Key: {id: this._id}
        };

        try {
            const result: DocumentClient.GetItemOutput = await DynamoConnection.getDocumentClient().get(params).promise();
            super.emit("SUCCESS", JSON.stringify({message: 'Success', Item: result.Item}));
        } catch(error) {
            super.emit("ERROR", JSON.stringify({message: 'Internal Server Error'}));
        }
    }
}