dynamodb-typescript
============================

## Objective
It's a package which makes it easier work with dynamodb and typescript. 
It is Propf of concept, then is necessary exists some improvements to do.

## Usage
1- Configure enviroment variables
 - process.env.DYNAMODB_HOST
 - process.env.DYNAMODB_PORT

2- Create an Entity like as:

´´´
import { Model } from "../../dynamodb-typescript/infrastructure/Model";
import { Entity } from "../../dynamodb-typescript/domain/Entity";

@Model(process.env.DYNAMODB_EQUIPMENT_TABLE)
export class Equipment extends Entity {}
´´´
3- Create a Repository like as:

´´´
import { Equipment } from "../domain/Equipment"
import { IEquipmentRepository } from "../domain/IEquipmentRepository";
import { DynamoRepository } from "../../dynamodb-typescript/infrastructure/DynamoRepository";

export class EquipmentRepository extends DynamoRepository<Equipment> implements IEquipmentRepository {
    
}
´´´

4- Create a interface to Repository like as:
´´´
import { Equipment } from "./Equipment";
import { IDynamoRepository } from "../../dynamodb-typescript/domain/IDynamoRepository";

export interface IEquipmentRepository extends IDynamoRepository<Equipment>  {  
}
´´´



