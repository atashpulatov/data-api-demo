import UnknownPropertyError from './unknown-property-error';
import propertiesEnum from './properties-enum';

class StorageService {
    constructor() {
    }
    setProperty(propertyToBeSet, propertyValue) {
        let foundProperty = false;
        for (let propertyKey in propertiesEnum) {
            if (propertiesEnum.hasOwnProperty(propertyKey)) {
                if (propertyToBeSet === propertiesEnum[propertyKey]) {
                    foundProperty = true;
                    break;
                }
            }
        }
        if (!foundProperty) {
            throw new UnknownPropertyError(propertyToBeSet, propertyValue);
        } else {
            sessionStorage.setItem(propertyToBeSet, propertyValue);
        }
    };
    getProperty(propertyName) {
        return sessionStorage.getItem(propertyName);
    };
}

export default new StorageService();
