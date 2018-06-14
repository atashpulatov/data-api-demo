import UnknownPropertyError from './unknown-property-error';
import propertiesEnum from './properties-enum';

class StorageService {
    constructor() {
    }
    setProperty(propertyAlias, propertyValue) {
        if (propertiesEnum[propertyAlias] === undefined) {
            throw new UnknownPropertyError(propertyAlias, propertyValue);
        } else {
            const propertyName = propertiesEnum[propertyAlias];
            sessionStorage.setItem(propertyName, propertyValue);
        }
    };
    getProperty(propertyName) {
        return sessionStorage.getItem(propertyName);
    };
}

export default new StorageService();
