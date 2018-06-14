import UnknownPropertyError from './unknown-property-error';
import propertiesEnum from './properties-enum';


class StorageService {
    constructor() {
    }
    // getProperty(propertiesEnum.projectId);
    setProperty(propertyAlias, propertyValue) {
        if (propertiesEnum[propertyAlias] === undefined) {
            throw new UnknownPropertyError(propertyAlias, propertyValue);
        } else {
            const propertyName = propertiesEnum[propertyAlias];
            sessionStorage.setItem(propertyName, propertyValue);
        }
    };
}

export default new StorageService();
