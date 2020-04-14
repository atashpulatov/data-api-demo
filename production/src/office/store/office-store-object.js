import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { errorService } from '../../error/error-handler';
import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import officeStoreHelper from './office-store-helper';

class OfficeStoreObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

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

  removeObjectFromStore = (objectWorkingId) => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
    this.removeObjectInExcelStore(objectWorkingId);
  };

  saveObjectsInExcelStore = async () => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(officeProperties.storedObjects, objects);
    await settings.saveAsync();
  };
}

const officeStoreObject = new OfficeStoreObject();
export default officeStoreObject;
