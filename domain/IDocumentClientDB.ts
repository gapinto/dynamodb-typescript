import { IClientDB } from './IClientDB'
import { ScanInput } from 'aws-sdk/clients/dynamodb';
import { EventEmitter } from 'events';

export interface IDocumentClientDB extends IClientDB {
    scan(scanInput: ScanInput): EventEmitter; 
}