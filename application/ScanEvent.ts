import { EventEmitter } from "events";
import { DocumentClientDB } from "../infrastructure/DocumentClientDB";
import { DocumentClient, ScanInput, ScanOutput } from "aws-sdk/clients/dynamodb";
import { DynamoConnection } from "../infrastructure/DynamoConnection";

export class ScanEvent extends EventEmitter {

    private _scanInput: ScanInput;
    private static instance: ScanEvent = null;

    private constructor(scanInput: ScanInput) {
        super();

        this._scanInput = scanInput;
    }

    public static getInstance(scanInput: ScanInput) : ScanEvent {
        if (!ScanEvent.instance) {
            ScanEvent.instance = new ScanEvent(scanInput);
        } else {
            ScanEvent.instance._scanInput = scanInput;
        }
            
        return ScanEvent.instance;
    }

    public async execute() {
        try {
            const documentClient = DynamoConnection.getDocumentClient();
            const scanOutput: DocumentClient.ScanOutput = await documentClient.scan(this._scanInput).promise();
            while(this._scanInput.FilterExpression && scanOutput.LastEvaluatedKey) {
                const scanOutputInside: DocumentClient.ScanOutput = await documentClient.scan(this._scanInput).promise();
                this._scanInput.ExclusiveStartKey = scanOutputInside.LastEvaluatedKey;
                scanOutput.LastEvaluatedKey = scanOutputInside.LastEvaluatedKey;
                scanOutput.Items = scanOutputInside.Items.concat(scanOutput.Items);
            }

            super.emit("SUCCESS", JSON.stringify(scanOutput));
        } catch(error) {
            super.emit("ERROR", JSON.stringify(error));
        }
    }
}