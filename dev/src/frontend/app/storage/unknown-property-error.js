export class UnknownPropertyError {
    constructor(propertyName, propertyValue) {
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
    }
    toString() {
        return `The property ${this.propertyName} was not found.
                \nValue ${this.propertyValue} will not be assigned.`;
    };
};
