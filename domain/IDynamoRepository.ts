'use strict';

import { Entity } from "./Entity";
import { IRepository } from "./IRepository";
import { Filter } from "./Filter";
import { EventEmitter } from 'events';

export interface IDynamoRepository<T extends Entity> extends IRepository<T>{
    findByQueryParameters(tableName: string, exclusiveStartKey: string, filters: Filter[]): EventEmitter;
}