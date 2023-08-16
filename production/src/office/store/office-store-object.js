import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { errorService } from '../../error/error-handler';
import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import officeStoreHelper from './office-store-helper';

class OfficeStoreObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
  * Removes object from office settings based on passed objectWorkingId
  *
  */
  removeObjectInExcelStore = (objectWorkingId) => {
    try {
      const settings = officeStoreHelper.getOfficeSettings();
      if (objectWorkingId) {
        const storedObjects = settings.get(officeProperties.storedObjects);
        const indexOfReport = storedObjects.findIndex((report) => (report.objectWorkingId === objectWorkingId));
        if (indexOfReport !== -1) {
          storedObjects.splice(indexOfReport, 1);
          settings.set(officeProperties.storedObjects, storedObjects);
        }
      }

      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  };

  /**
  * Removes object from redux and office settings based on passed objectWorkingId
  *
  */
  // FIXME: not used anywhere. TO BE REMOVED
  removeObjectFromStore = (objectWorkingId) => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
    this.removeObjectInExcelStore(objectWorkingId);
  };

  /**
  * Saves current objects list from Object Reducer in Office Settings
  *
  */
  saveObjectsInExcelStore = async () => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(officeProperties.storedObjects, objects);
    await settings.saveAsync();
  };

  /**
  * Saves current answers list from Answer Reducer in Office Settings
  *
  */
  saveAnswersInExcelStore = async () => {
    const { answers } = this.reduxStore.getState().answersReducer;
    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(officeProperties.storedAnswers, answers);
    await settings.saveAsync();
  };
}

const officeStoreObject = new OfficeStoreObject();
export default officeStoreObject;
