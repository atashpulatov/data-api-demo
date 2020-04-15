import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { errorService } from '../../error/error-handler';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import officeStoreHelper from './office-store-helper';

class OfficeStoreRestoreObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
  * Retrieves information about object imported in previous versions,
  * maps them to new format of data and stores them in Redux and Office Settings,
  * and then remove the previosuly stored informations from Office settings
  *
  */
  restoreObjectsFromExcelStore = () => {
    const settings = officeStoreHelper.getOfficeSettings();
    let objects = settings.get(officeProperties.storedObjects) || [];
    objects = this.restoreLegacyObjectsFromExcelStore(objects);

    objects && this.reduxStore.dispatch(restoreAllObjects(objects));

    settings.set(officeProperties.loadedReportProperties, []);
    settings.set(officeProperties.storedObjects, objects);
    settings.saveAsync((saveAsync) => console.log(`Clearing report Array in settings ${saveAsync.status}`));
  };


  /**
  * Maps previously stored objects information to new format of data
  *
  * @param {Array} [objects] Objects imported in previous version of plugin
  * @return {Array} New objects and old objects converted to new format of data
  */
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

  /**
  * Maps values from legacy object to new key used in new data format
  *
  * @param {Object} object Object imported in previous version of plugin
  * @param {String} newKey New name of the field
  * @param {String} oldKey Old name of the field
  */
  mapLegacyObjectValue = (object, newKey, oldKey) => {
    if (object[oldKey]) {
      object[newKey] = object[oldKey];
      delete object[oldKey];
    }
  };

  /**
  * Retrieves list of objects imported in previous versions,
  *
  * @return {Array} Contains legacy objects data
  * @throws Error on failed execution of Office api function
  */
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
