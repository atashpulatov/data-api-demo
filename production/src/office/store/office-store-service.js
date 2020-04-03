import { officeProperties } from './office-properties';
import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import { errorService } from '../../error/error-handler';
import { restoreAllObjects, removeObject } from '../../operation/object-actions';

/* global Office */

// TODO check after integration of new right panel
class OfficeStoreService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  getOfficeSettings = () => {
    if (Office === undefined || Office.context === undefined || Office.context.document === undefined) {
      throw new RunOutsideOfficeError();
    }
    return Office.context.document.settings;
  }

  restoreObjectsFromExcelStore = () => {
    const settings = this.getOfficeSettings();
    let objects = settings.get(officeProperties.storedObjects) || [];
    objects = this.restoreLegacyObjectsFromExcelStore(objects);

    objects && this.reduxStore.dispatch(restoreAllObjects(objects));

    settings.set(officeProperties.loadedReportProperties, []);
    settings.set(officeProperties.storedObjects, objects);
    settings.saveAsync((saveAsync) => console.log(`Clearing report Array in settings ${saveAsync.status}`));
  };

  restoreLegacyObjectsFromExcelStore = (objects = []) => {
    const reportArray = this.getLegacyObjectsList();
    const objectsToBeAdded = [];

    if (reportArray) {
      for (let index = 0; index < reportArray.length; index++) {
        const currentObject = JSON.parse(JSON.stringify(reportArray[index]));
        if (!objects || !objects.find(object => object.bindId === currentObject.bindId)) {
          this.mapLegacyObjectValue(currentObject, 'objectId', 'id');
          this.mapLegacyObjectValue(currentObject, 'mstrObjectType', 'objectType');
          this.mapLegacyObjectValue(currentObject, 'previousTableDimensions', 'tableDimensions');
          this.mapLegacyObjectValue(currentObject, 'subtotalsInfo', 'subtotalInfo');

          // TODO find better way for unique Id
          currentObject.objectWorkingId = Date.now() + (index * reportArray.length);
          objectsToBeAdded.push(currentObject);
        }
      }
    }
    return [...objects, ...objectsToBeAdded];
  }

  mapLegacyObjectValue = async (object, newKey, oldKey) => {
    try {
      if (object[oldKey]) {
        object[newKey] = object[oldKey];
        delete object[oldKey];
      }
    } catch (error) {
      console.log('error:', error);
    }
  }


  getLegacyObjectsList = () => {
    try {
      const settings = this.getOfficeSettings();
      if (!(settings.get(officeProperties.loadedReportProperties))) {
        const reportProperties = [];
        settings.set(officeProperties.loadedReportProperties, reportProperties);
        settings.saveAsync();
      }
      return settings.get(officeProperties.loadedReportProperties);
    } catch (error) {
      errorService.handleError(error);
    }
  };

  getObjectsListFromObjectReducer = () => this.reduxStore.getState().objectReducer.objects;

  getOperationsListFromOperationReducer = () => this.reduxStore.getState().operationReducer.operations;

  getObjectFromObjectReducer = (bindId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find((object) => object.bindId === bindId);
  };


  modifyObjectValue = async (bindId, key, value) => {
    try {
      const settings = this.getOfficeSettings();
      const objects = settings.get(officeProperties.storedObjects);
      const indexOfReport = objects.findIndex((object) => (object.bindId === bindId));
      objects[indexOfReport][key] = value;
      settings.set(officeProperties.storedObjects, objects);
      await settings.saveAsync();
      await this.loadExistingReportBindingsExcel();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  deleteObject = (bindId, objectWorkingId) => {
    try {
      const settings = this.getOfficeSettings();
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
  }

  removeObjectFromStore = (bindId, objectWorkingId) => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
    this.deleteObject(bindId, objectWorkingId);
  };

  saveObjectsInExcelStore = async () => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const settings = this.getOfficeSettings();
    settings.set(officeProperties.storedObjects, objects);
    // TODO: check if needed
    await settings.saveAsync();
    // TODO: uncomment below
    // this.reduxStore.dispatch(markStepCompleted(objectData.objectWorkingId, SAVE_OBJECT_IN_EXCEL));
  }

  toggleFileSecuredFlag = (value) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(officeProperties.isSecured, value);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  isFileSecured = () => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.isSecured);
    } catch (error) {
      errorService.handleError(error);
    }
  }
}

export const officeStoreService = new OfficeStoreService();
