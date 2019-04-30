'use strict'
export enum Condition {
    EQ = '=',
    BEGINS_WITH = 'begins_with(#, :t)',
    CONTAINS = 'contains(#, :t)'
}