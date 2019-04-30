import { KeyConditionExpressionBuilder } from './KeyConditionExpressionBuilder';
import { ExpressionAttributeNameMap, AttributeName, ExpressionAttributeValueMap, ScanInput, Key } from 'aws-sdk/clients/dynamodb';
import { AttributeValue } from 'aws-sdk/clients/dynamodbstreams';
import { Condition } from './Condition';
import { Util } from '../../common/Util';

export class FilterExpressionBuilder {

    private scanInput: ScanInput = {TableName: ''};
    private filterExpression: string = '';
    private expressionAttributeNameMap: ExpressionAttributeNameMap = {};
    private expressionAttributeValueMap: ExpressionAttributeValueMap = {};
    
    constructor(private _tableName: string,
                private _limit?: number, 
                private _exclusiveStartKey?:any){
        this.scanInput.TableName = this._tableName;
        if(this._limit) {
            this.scanInput.Limit = this._limit;
        }
    }

    set exclusiveStartKey (exclusiveStartKey: string) {
        if(this._exclusiveStartKey) {
            /* let attr : AttributeValue = {S: excluisiveStartKey};*/
            let excluisiveStartKeyValue: Key = {"id": this._exclusiveStartKey}; 
            this.scanInput.ExclusiveStartKey = excluisiveStartKeyValue;
        }
    }

    where(attributeName: string, attributeValue: any, condition: Condition) : FilterExpressionBuilder {
        if(attributeValue) {
            if(this.filterExpression != '') {
                this.filterExpression = this.filterExpression.concat(' AND '); 
            }
            let keyExpressionAttributeNameMap: string = '#' + attributeName; 
            let keyExpressionAttributeValueMap: string = ':' + attributeName + 'Value';
            this.expressionAttributeNameMap[keyExpressionAttributeNameMap] = attributeName;
            let value: any = Util.removeSpecialChar(attributeValue);
            this.expressionAttributeValueMap[keyExpressionAttributeValueMap] = value;
            
            if(Condition.BEGINS_WITH == condition || Condition.CONTAINS == condition) {
                this.filterExpression = this.filterExpression.concat(condition.replace('#', keyExpressionAttributeNameMap).replace(':t', keyExpressionAttributeValueMap));
            } else {
                this.filterExpression = this.filterExpression.concat(keyExpressionAttributeNameMap + ' '+ condition + ' ' + keyExpressionAttributeValueMap);
            }
        }
        return this;
    }

    build() : ScanInput {
        if(this.filterExpression != '') {
            this.scanInput.ExpressionAttributeValues = this.expressionAttributeValueMap;
            this.scanInput.ExpressionAttributeNames = this.expressionAttributeNameMap,
            this.scanInput.FilterExpression = this.filterExpression;
        }
        return this.scanInput;
    }
}