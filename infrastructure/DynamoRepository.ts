'use strict';
import { ScanInput } from 'aws-sdk/clients/dynamodb';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Callback } from 'aws-lambda';
import { Repository } from './Repository';
import { Entity } from '../domain/Entity';
import { IDocumentClientDB } from '../domain/IDocumentClientDB';
import { FilterExpressionBuilder } from '../domain/FilterExpressionBuilder';
import { EventEmitter } from 'events';
import { Filter } from '../domain/Filter';
import { IDynamoRepository } from '../domain/IDynamoRepository';
import { DocumentClientDB } from './DocumentClientDB';

export class DynamoRepository<T extends Entity> extends Repository<T> implements IDynamoRepository<Entity>{
    
    private _documentClientDB: IDocumentClientDB;

    constructor(documentClientDB: IDocumentClientDB = new DocumentClientDB()){
        super(documentClientDB);

        this._documentClientDB = documentClientDB;
    }

    findByQueryParameters(tableName: string, exclusiveStartKey: string, filters: Filter[] = []): EventEmitter{
        let filterExpressionBuilder = new FilterExpressionBuilder(tableName, 10);
        filterExpressionBuilder.exclusiveStartKey = exclusiveStartKey;
        
        if(!exclusiveStartKey && filters.length > 0) {
            filterExpressionBuilder = filters.reduce((filterExpressionBuilder, filter) =>{
                filterExpressionBuilder.where(filter.name, filter.value, filter.condition);
                return filterExpressionBuilder;
            }, filterExpressionBuilder);
        }
        
        return this._documentClientDB.scan(filterExpressionBuilder.build());
    }
    
}