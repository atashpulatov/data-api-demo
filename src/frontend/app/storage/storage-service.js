import UnknownPropertyError from './unknown-property-error';
import sessionPropertiesEnum from './session-properties';

class StorageService {
    constructor() {
    }

    setProperty(propertyToBeSet, propertyValue) {
        let foundProperty = false;
        for (let propertyKey in sessionPropertiesEnum) {
            if (sessionPropertiesEnum.hasOwnProperty(propertyKey)) {
                if (propertyToBeSet === sessionPropertiesEnum[propertyKey]) {
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
