import { Condition } from './Condition';

export class Filter {
    
    private _name: string;
    private _value: string;
    private _condition: Condition;

    constructor(name: string, value: string, condition: Condition){
        this._name = name;
        this._value = value;
        this.condition = condition;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    get condition(): Condition {
        return this._condition;
    }

    set condition(condition: Condition) {
        this._condition = condition;
    }
}