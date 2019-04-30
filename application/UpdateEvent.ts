import { EventEmitter } from "events";
import { DocumentClientDB } from "../infrastructure/DocumentClientDB";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DynamoConnection } from "../infrastructure/DynamoConnection";

export class UpdateEvent extends EventEmitter {

    private static instance: UpdateEvent = null;
    private _tableName: string;
    private _object: {};

    private constructor(tableName: string, object: {}) {
        super();

        this._tableName = tableName;
        this._object = object;
    }


    public static getInstance(tableName: string, object: {}) : UpdateEvent {
        if (!UpdateEvent.instance) {
            UpdateEvent.instance = new UpdateEvent(tableName, object);
        } else {
            UpdateEvent.instance._tableName = tableName;
            UpdateEvent.instance._object =  object; 
        }
            
        return UpdateEvent.instance;
        
    }

    public async execute() {
        const params = {
            TableName: this._tableName,
            Item: this._object,
            ReturnValues: 'ALL_OLD'
        };

        try {
            const result: DocumentClient.PutItemOutput= await DynamoConnection.getDocumentClient().put(params).promise();
            super.emit("SUCCESS", JSON.stringify(result.Attributes));
        } catch(error) {
            super.emit("ERROR", JSON.stringify({message: 'Internal Server Error'}));
        }
    }
}