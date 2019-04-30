'use strict';
import { ErrorDynamoDB } from '../domain/ErrorDynamoDB';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient, AttributeValue, Key, ScanInput, ExpressionAttributeValueMap, ExpressionAttributeNameMap } from 'aws-sdk/clients/dynamodb';
import { EventEmitter } from 'events';
import { UpdateEvent } from '../application/UpdateEvent';
import { PutEvent } from '../application/PutEvent';
import { GetEvent } from '../application/GetEvent';
import { DeleteEvent } from '../application/DeleteEvent';
import { IDocumentClientDB } from '../domain/IDocumentClientDB';
import { ScanEvent } from '../application/ScanEvent';

export class DocumentClientDB extends EventEmitter implements IDocumentClientDB {

    public update(tableName: string, object: {}): EventEmitter {
        return UpdateEvent.getInstance(tableName, object);
    }

    public put(tableName: string, object: {}): EventEmitter {
        return PutEvent.getInstance(tableName, object);
    }

    public get(tableName: string, id: string): EventEmitter {
        return GetEvent.getInstance(tableName, id);
    }

    public delete(tableName: string, id: string): EventEmitter {
        return DeleteEvent.getInstance(tableName, id);
    }

    public scan(scanInput: ScanInput): EventEmitter {
        return ScanEvent.getInstance(scanInput);
    }

}
