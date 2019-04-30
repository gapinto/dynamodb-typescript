'use strict';
import { EventEmitter } from 'events';

export interface IClientDB {

    update (tableName: string, object: {}): EventEmitter;

    put(tableName: string, object: {}): EventEmitter;

    get(tableName: string, id: string):  EventEmitter;

    delete (tableName: string, id: string):  EventEmitter;

}
