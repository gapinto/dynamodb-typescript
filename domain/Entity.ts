'use strict';
export abstract class Entity {
    

    private _tableName: string;
    private _id: string;
    private _next: string;
    
    constructor(){}

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get tableName(): string {
        return this._tableName;
    }

    set tableName(tableName: string) {
        this._tableName = tableName;
    }

    get next(): string {
        return this._next;
    }
    
    set next(next: string) {
        this._next = next;
    }
    
    public toJSON() {
        const object =  Object.getOwnPropertyNames(this).reduce((a, b) =>{
            a[b.replace('_', '')] = this[b];
            return a;
        }, {});
        return object;
    }
}