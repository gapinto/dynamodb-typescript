import { EventEmitter } from "events";
import { DocumentClientDB } from "../infrastructure/DocumentClientDB";
import { DocumentClient, QueryInput } from "aws-sdk/clients/dynamodb";
import { DynamoConnection } from "../infrastructure/DynamoConnection";

export class QueryEvent extends EventEmitter {

    private static instance: QueryEvent = null;
    private _queryInput: QueryInput;

    private constructor(queryInput: QueryInput) {
        super();

        this._queryInput = queryInput;
    }

    public static getInstance(queryInput: QueryInput) : QueryEvent {
        if (!QueryEvent.instance) {
            QueryEvent.instance = new QueryEvent(queryInput);
        } else {
            QueryEvent.instance._queryInput = queryInput;
        }
            
        return QueryEvent.instance;
    }

    public async execute() {
        try {
            const result: DocumentClient.QueryOutput = await DynamoConnection.getDocumentClient().query(this._queryInput).promise();
            super.emit("SUCCESS", JSON.stringify(result));
        } catch(error) {
            super.emit("ERROR", JSON.stringify({message: 'Internal Server Error'}));
        }
    }
}