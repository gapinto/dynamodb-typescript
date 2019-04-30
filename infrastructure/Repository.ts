'use strict';
import { ScanInput } from 'aws-sdk/clients/dynamodb';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Callback } from 'aws-lambda';
import { Entity } from '../domain/Entity'
import { IRepository } from '../domain/IRepository';
import { IClientDB } from '../domain/IClientDB';
import { EventEmitter } from "events";

export class Repository<T extends Entity> implements IRepository<T>{
    
    private _clientDB: IClientDB;

    constructor(clientDB: IClientDB){
        this._clientDB = clientDB;
    }

    add(entity: T): EventEmitter {
        entity.id = uuid();
        return this._clientDB.put(entity.tableName, entity.toJSON());
    }
    
    remove(entity: T): EventEmitter {
        if (!entity.id) {
            throw new Error("id attribute shoud be informed.");
        }

        return this._clientDB.delete(entity.tableName, entity.id);
    }

    findById(entity: T): EventEmitter {
        if (!entity.id) {
            throw new Error("id attribute shoud be informed.");
        }
        
        return this._clientDB.get(entity.tableName, entity.id);
    }

    update(entity: T): EventEmitter {
        return this._clientDB.update(entity.tableName, entity.toJSON());
    }
}