'use strict';
/* https://github.com/arolson101/typescript-decorators#class-decorator */
const Model = (tableName: string) => {
    const changeConstructor = (target: Function) => {
        target.prototype.tableName = tableName;
    }
    return changeConstructor;
}

export {Model};