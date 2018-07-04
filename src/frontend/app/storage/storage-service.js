import UnknownPropertyError from './unknown-property-error';
import { sessionProperties} from './session-properties';

class StorageService {
    constructor() {
    }

    setProperty(propertyToBeSet, propertyValue) {
        let foundProperty = false;
        for (let propertyKey in sessionProperties) {
            if (sessionProperties.hasOwnProperty(propertyKey)) {
                if (propertyToBeSet === sessionProperties[propertyKey]) {
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
