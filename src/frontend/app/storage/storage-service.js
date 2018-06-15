import UnknownPropertyError from './unknown-property-error';
import propertiesEnum from './properties-enum';

class StorageService {
    constructor() {
    }
    setProperty(propertyCandidate, propertyValue) {
        let found = false;
        for (let defProperty in propertiesEnum) {
            if (propertiesEnum.hasOwnProperty(defProperty)) {
                if (propertyCandidate === propertiesEnum[defProperty]) {
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            throw new UnknownPropertyError(propertyCandidate, propertyValue);
        } else {
            sessionStorage.setItem(propertyCandidate, propertyValue);
        }
    };
    getProperty(propertyName) {
        return sessionStorage.getItem(propertyName);
    };
}

export default new StorageService();
