import { EventEmitter } from "events";
import { DynamoConnection } from "../infrastructure/DynamoConnection";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class DeleteEvent extends EventEmitter {

    private static instance: DeleteEvent = null;
    private _tableName: string;
    private _id: {};

    private constructor(tableName: string, id: string) {
        super();

        this._tableName = tableName;
        this._id = id;
    }

    public static getInstance(tableName: string, id: string) : DeleteEvent {
        if (!DeleteEvent.instance) {
            DeleteEvent.instance = new DeleteEvent(tableName, id);
        } else {
            DeleteEvent.instance._tableName = tableName;
            DeleteEvent.instance._id = id;
        }
            
        return DeleteEvent.instance;
    }

    public async execute() {
        const params = {
            TableName: this._tableName,
            Key: {id: this._id},
            ReturnValues: 'ALL_OLD'
        };

        try {
            const result: DocumentClient.AttributeMap = await DynamoConnection.getDocumentClient().delete(params).promise();
            super.emit("SUCCESS", JSON.stringify(result.Attributes));
        } catch(error) {
            super.emit("ERROR", JSON.stringify({message: 'Internal Server Error'}));
        }
    }
}