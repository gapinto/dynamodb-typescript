dynamodb-typescript
============================

## Objective
It's a package which makes it easier work with dynamodb and typescript. 
It's just an initial work, you are free to contribute.

## Usage
1. Configure enviroment variables
 - process.env.DYNAMODB_HOST
 - process.env.DYNAMODB_PORT

2. Create an Entity:

```typescript
import { Model } from "../../dynamodb-typescript/infrastructure/Model";
import { Entity } from "../../dynamodb-typescript/domain/Entity";

@Model(process.env.DYNAMODB_EQUIPMENT_TABLE)
export class Equipment extends Entity {}
```
3. Create a Repository:

```typescript
import { Equipment } from "../domain/Equipment"
import { IEquipmentRepository } from "../domain/IEquipmentRepository";
import { DynamoRepository } from "../../dynamodb-typescript/infrastructure/DynamoRepository";

export class EquipmentRepository extends DynamoRepository<Equipment> implements IEquipmentRepository {}
```

4. Create a interface to Repository:
```typescript
import { Equipment } from "./Equipment";
import { IDynamoRepository } from "../../dynamodb-typescript/domain/IDynamoRepository";

export interface IEquipmentRepository extends IDynamoRepository<Equipment>  { }
```

5- Create a service:
```typescript
import { EventEmitter } from "events";
import { Equipment } from "../domain/Equipment";
import { IEquipmentRepository } from "../domain/IEquipmentRepository";
import { EquipmentRepository } from "../infrastructure/EquipmentRepository";

export class DeleteEquipment extends EventEmitter {

    private _equipmentRepository: IEquipmentRepository;
    
    constructor(equipmentRepository: IEquipmentRepository = new EquipmentRepository()) {
        super();
        this._equipmentRepository = equipmentRepository; 
    }

    public execute(equipmentData: Equipment) {
        const equipment = new Equipment();
        equipment.id = equipmentData.id;

        return this._equipmentRepository.remove(equipment)
        .on("SUCCESS", (equipment) => {
            super.emit("SUCCESS", equipment)
        })
        .on("ERROR", (error) => {
            super.emit("ERROR", "Internal Error");
        })
        .execute();
    }
}
```

- Note: `EquipmentRepository` could have been injected, but for now that's it.

