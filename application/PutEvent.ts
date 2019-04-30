import { EventEmitter } from "events";
import { DocumentClientDB } from "../infrastructure/DocumentClientDB";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ErrorDynamoDB } from "../domain/ErrorDynamoDB";
import { DynamoConnection } from "../infrastructure/DynamoConnection";

export class PutEvent extends EventEmitter {

    private static instance: PutEvent = null;
    private _tableName: string;
    private _object: {};

    private constructor(tableName: string, object: {}) {
        super();

        this._tableName = tableName;
        this._object = object;
    }

    public static getInstance(tableName: string, object: {}) : PutEvent {
        if (!PutEvent.instance) {
            PutEvent.instance = new PutEvent(tableName, object);
        } else {
            PutEvent.instance._tableName = tableName;
            PutEvent.instance._object = object;
        }
            
        return PutEvent.instance;
    }

    public async execute() {
        const params = {
            TableName: this._tableName,
            Item: this._object,
            ReturnValues: 'ALL_OLD'
        };
       
        try {
            const result: DocumentClient.AttributeMap =   await DynamoConnection.getDocumentClient().put(params).promise();
            super.emit("SUCCESS", JSON.stringify(this._object));
        } catch(error) {
            super.emit("ERROR", JSON.stringify({message: 'Internal Server Error'}));
        }
    }
}