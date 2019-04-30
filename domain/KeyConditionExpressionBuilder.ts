import { ExpressionAttributeNameMap, AttributeName, ExpressionAttributeValueMap, Key, QueryInput } from 'aws-sdk/clients/dynamodb';
import { AttributeValue } from 'aws-sdk/clients/dynamodbstreams';
import { Condition } from './Condition';
import { Util } from '../../common/Util';

export class KeyConditionExpressionBuilder {

    private expressionAttributeNameMap: ExpressionAttributeNameMap = {};
    private expressionAttributeValueMap: ExpressionAttributeValueMap = {};
    private queryInput: QueryInput= {TableName: ''};
    private keyConditionExpression: string = '';
    
    constructor(private _indexName: string, private _tableName: string, private _exclusiveStartKey?: any){
        this.queryInput.TableName = _tableName;
        this.queryInput.IndexName = _indexName;
    }

    set exclusiveStartKey (exclusiveStartKey: string) {
        if(this._exclusiveStartKey) {
            /* let attr : AttributeValue = {S: excluisiveStartKey};*/
            let excluisiveStartKeyValue: Key = {"id": this._exclusiveStartKey}; 
            this.queryInput.ExclusiveStartKey = excluisiveStartKeyValue;
        }
    }

    where(attributeName: string, attributeValue: any, condition: Condition) : KeyConditionExpressionBuilder {
        if(attributeValue) {
            if(this.keyConditionExpression != '') {
                this.keyConditionExpression = this.keyConditionExpression.concat(' AND '); 
            }
            let keyExpressionAttributeNameMap: string = '#' + attributeName; 
            let keyExpressionAttributeValueMap: string = ':' + attributeName + 'Value';
            this.expressionAttributeNameMap[keyExpressionAttributeNameMap] = attributeName;
            let value: any = Util.removeSpecialChar(attributeValue);
            this.expressionAttributeValueMap[keyExpressionAttributeValueMap] = value;
            
            if(Condition.BEGINS_WITH == condition || Condition.CONTAINS == condition) {
                this.keyConditionExpression = this.keyConditionExpression.concat(condition.replace('#', keyExpressionAttributeNameMap).replace(':t', keyExpressionAttributeValueMap));
            } else {
                this.keyConditionExpression = this.keyConditionExpression.concat(keyExpressionAttributeNameMap + ' '+ condition + ' ' + keyExpressionAttributeValueMap);
            }
        }
        return this;
    }

    build() : QueryInput {
        if(this.keyConditionExpression != '') {
            this.queryInput.ExpressionAttributeValues = this.expressionAttributeValueMap;
            this.queryInput.ExpressionAttributeNames = this.expressionAttributeNameMap,
            this.queryInput.KeyConditionExpression = this.keyConditionExpression;
        }
        return this.queryInput;
    }
}