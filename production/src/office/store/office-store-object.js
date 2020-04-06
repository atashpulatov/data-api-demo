import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { errorService } from '../../error/error-handler';
import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import officeStoreHelper from './office-store-helper';

class OfficeStoreObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  modifyObjectValue = async (bindId, key, value) => {
    try {
      const settings = officeStoreHelper.getOfficeSettings();
      const objects = settings.get(officeProperties.storedObjects);
      const indexOfReport = objects.findIndex((object) => (object.bindId === bindId));
      objects[indexOfReport][key] = value;
      settings.set(officeProperties.storedObjects, objects);
      await settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  };

  removeObjectInExcelStore = (objectWorkingId) => {
    try {
      const settings = officeStoreHelper.getOfficeSettings();
      if (objectWorkingId) {
        const storedObjects = settings.get(officeProperties.storedObjects);
        const indexOfReport = storedObjects.findIndex((report) => (report.objectWorkingId === objectWorkingId));
        storedObjects.splice(indexOfReport, 1);
        settings.set(officeProperties.storedObjects, storedObjects);
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
    // TODO: check if needed
    await settings.saveAsync();
    // TODO: uncomment below
    // this.reduxStore.dispatch(markStepCompleted(objectData.objectWorkingId, SAVE_OBJECT_IN_EXCEL));
  };
}

const officeStoreObject = new OfficeStoreObject();
export default officeStoreObject;
