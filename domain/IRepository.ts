'use strict';
import { Entity } from '../domain/Entity'
import { EventEmitter } from "events";

export interface IRepository<T extends Entity> {
    add(entity: T): EventEmitter;
    
    remove(entity: T): EventEmitter;

    findById(entity: T): EventEmitter;

    update(entity: T): EventEmitter;
}