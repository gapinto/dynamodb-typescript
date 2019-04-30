'use strict';
export class ErrorDynamoDB extends Error {
    constructor(statusCode: number, message: string){
        super();
    }
}