import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { errorService } from '../../error/error-handler';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import officeStoreHelper from './office-store-helper';

class OfficeStoreRestoreObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  restoreObjectsFromExcelStore = () => {
    const settings = officeStoreHelper.getOfficeSettings();
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
  };

  mapLegacyObjectValue = (object, newKey, oldKey) => {
    if (object[oldKey]) {
      object[newKey] = object[oldKey];
      delete object[oldKey];
    }
  };

  getLegacyObjectsList = () => {
    try {
      const settings = officeStoreHelper.getOfficeSettings();
      if (!(settings.get(officeProperties.loadedReportProperties))) {
        settings.set(officeProperties.loadedReportProperties, []);
        settings.saveAsync();
      }
      return settings.get(officeProperties.loadedReportProperties);
    } catch (error) {
      errorService.handleError(error);
    }
  };
}

const officeStoreRestoreObject = new OfficeStoreRestoreObject();
export default officeStoreRestoreObject;
