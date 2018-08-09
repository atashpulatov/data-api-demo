import UnknownPropertyError from './unknown-property-error';
import { sessionProperties } from './session-properties';
import { reduxStore } from '../store';

class StorageService {
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
            reduxStore.dispatch({
                type: sessionProperties.actions.setProperty,
                propertyName: propertyToBeSet,
                propertyValue: propertyValue,
            });
        }
    };

    getProperty(propertyName) {
        const constSessionStateProps = reduxStore
            .getState().sessionReducer;
        return constSessionStateProps[propertyName];
        // return sessionStorage.getItem(propertyName);
    };
}

export const storageService = new StorageService();
