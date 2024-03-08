import officeStoreHelper from './office-store-helper';

import { errorService } from '../../error/error-handler';
import { restoreAllAnswers } from '../../redux-reducer/answers-reducer/answers-actions';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { objectImportType } from '../../mstr-object/constants';

class OfficeStoreRestoreObject {
  init = reduxStore => {
    this.reduxStore = reduxStore;
  };

  /**
   * Retrieves information about object imported in previous versions,
   * maps them to new format of data and stores them in Redux and Office Settings,
   * and then remove the previously stored information from Office settings
   */
  restoreObjectsFromExcelStore = () => {
    const settings = officeStoreHelper.getOfficeSettings();
    let objects = settings.get(officeProperties.storedObjects) || [];
    objects = this.restoreLegacyObjectsFromExcelStore(settings, objects);
    if (objects?.filter) {
      objects = objects.filter(object => !object.doNotPersist);
    }

    this.resetIsPromptedForDossiersWithAnswers(objects);
    this.restoreLegacyObjectsWithImportType(objects);

    objects && this.reduxStore.dispatch(restoreAllObjects(objects));

    settings.set(officeProperties.storedObjects, objects);
  };

  /**
   * Parse the objects and set 'importType' to 'TABLE' if it is not defined.
   *
   * @param {*} objects restored object definitions from excel document.
   */
  restoreLegacyObjectsWithImportType = objects => {
    objects?.forEach(object => {
      if (object && !object.importType) {
        object.importType = objectImportType.TABLE;
      }
    });
  };

  /**
   * Parse the objects and set the isPrompted flag to true if the dossier has prompt answers in the definition
   * and in the manipulationsXML properties, but isPrompted is false, and promptsAnswers is null.
   * This overrides the isPrompted flag, which was set to false in the previous version of the plugin even if
   * the dossier was prompted because it was loaded in consumption mode, and the user never had a chance to answer
   * the prompts or re-prompt the dossier to change the answers (it retained shortcut values).
   *
   * @param {*} objects restored object definitions from excel document.
   */
  resetIsPromptedForDossiersWithAnswers = objects => {
    objects
      ?.filter(object => object.mstrObjectType.type === 55)
      .forEach(object => {
        if (!object.isPrompted) {
          object.isPrompted = object.manipulationsXML?.promptAnswers !== undefined;
        }
      });
  };

  /**
   * Retrieves information about prompts answers imported in previous versions.
   * It fetches the information from Office Settings and stores it in Redux store.
   */
  restoreAnswersFromExcelStore = () => {
    const settings = officeStoreHelper.getOfficeSettings();
    const answers = settings.get(officeProperties.storedAnswers) || [];
    // If answers happens to be an empty array then it is still necessary
    // to dispatch it to clear the answers in Redux store.
    this.reduxStore.dispatch(restoreAllAnswers(answers));
  };

  /**
   * Maps previously stored objects information to new format of data
   *
   * @param {Array} [objects] Objects imported in previous version of plugin
   * @param {Office} settings Office settings that is required in order to use Office Api
   * @return {Array} New objects and old objects converted to new format of data
   */
  restoreLegacyObjectsFromExcelStore = (settings, objects = []) => {
    const reportArray = this.getLegacyObjectsList();
    const objectsToBeAdded = [];

    if (reportArray && reportArray.length > 0) {
      for (let index = 0; index < reportArray.length; index++) {
        const currentObject = JSON.parse(JSON.stringify(reportArray[index]));
        if (!objects || !objects.find(object => object.bindId === currentObject.bindId)) {
          this.mapLegacyObjectValue(currentObject, 'objectId', 'id');
          this.mapLegacyObjectValue(currentObject, 'mstrObjectType', 'objectType');
          this.mapLegacyObjectValue(currentObject, 'previousTableDimensions', 'tableDimensions');
          this.mapLegacyObjectValue(currentObject, 'subtotalsInfo', 'subtotalInfo');

          // TODO find better way for unique Id
          currentObject.objectWorkingId = Date.now() + index * reportArray.length;
          objectsToBeAdded.push(currentObject);
        }
      }
      settings.set(officeProperties.loadedReportProperties, []);
      settings.saveAsync(saveAsync =>
        console.log(`Clearing report Array in settings ${saveAsync.status}`)
      );
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
      if (!settings.get(officeProperties.loadedReportProperties)) {
        settings.set(officeProperties.loadedReportProperties, []);
        settings.saveAsync();
      }
      return settings.get(officeProperties.loadedReportProperties);
    } catch (error) {
      errorService.handleError(error);
    }
  };

  /**
   * Retrieves one setting from Excel,
   * @param {String} key
   * @return {Any} Contains settings value
   * @throws Error on failed execution of Office api function
   */
  getExcelSettingValue = key => {
    const settings = officeStoreHelper.getOfficeSettings();
    return settings.get(key);
  };
}

const officeStoreRestoreObject = new OfficeStoreRestoreObject();
export default officeStoreRestoreObject;
