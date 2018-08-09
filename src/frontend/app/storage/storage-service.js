import UnknownPropertyError from './unknown-property-error';
import { sessionProperties } from './session-properties';
import { sessionReducer } from './session-reducer';
import { createStore } from '../../../../node_modules/redux';

class StorageService {
    constructor() {
        this._sessionStore = createStore(sessionReducer);
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
            this._sessionStore.dispatch({
                type: sessionProperties.actions.setProperty,
                propertyName: propertyToBeSet,
                propertyValue: propertyValue,
            });
            // sessionStorage.setItem(propertyToBeSet, propertyValue);
        }
    };

    getProperty(propertyName) {
        return this._sessionStore.getState().propertyName;
        // return sessionStorage.getItem(propertyName);
    };
}

export default new StorageService();
