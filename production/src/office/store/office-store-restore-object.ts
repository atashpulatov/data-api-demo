import { officeApiHelper } from '../api/office-api-helper';
import officeStoreHelper from './office-store-helper';

import { ReduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { errorService } from '../../error/error-handler';
import { restoreAllAnswers } from '../../redux-reducer/answers-reducer/answers-actions';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import officeApiDataLoader from '../api/office-api-data-loader';
import { OfficeSettingsEnum } from '../../constants/office-constants';
import { ObjectImportType } from '../../mstr-object/constants';

class OfficeStoreRestoreObject {
  reduxStore: ReduxStore;

  init(reduxStore: ReduxStore): void {
    this.reduxStore = reduxStore;
  }

  /**
   * Retrieves information about object imported in previous versions,
   * maps them to new format of data and stores them in Redux and Office Settings,
   * and then remove the previously stored information from Office settings
   */
  restoreObjectsFromExcelStore = async (): Promise<void> => {
    const settings = officeStoreHelper.getOfficeSettings();
    let objects = settings.get(OfficeSettingsEnum.storedObjects) || [];
    objects = this.restoreLegacyObjectsFromExcelStore(settings, objects);
    if (objects?.filter) {
      objects = objects.filter((object: any) => !object.doNotPersist);
    }

    await this.restoreLegacyObjectsWithNewProps(objects);

    settings.set(OfficeSettingsEnum.storedObjects, objects);

    // Do filter image objects if the shape api is not supported
    // and only reflect udated objects in redux store and not back into office store.
    objects = this.filterImageObjects(objects);

    // Do filter formatted table objects if the shape api is not supported
    // and only reflect udated objects in redux store and not back into office store.
    objects = this.filterFormattedTableObjects(objects);

    // @ts-expect-error
    objects && this.reduxStore.dispatch(restoreAllObjects(objects));
  };

  /**
   * Filters out image objects if the shape api is not supported in current version in order to maintain the backward compatibility.
   *
   * @param objects
   * @returns objects object definitions from excel document
   */
  filterImageObjects = (objects: ObjectData[]): ObjectData[] => {
    const { isShapeAPISupported } = this.reduxStore.getState().officeReducer;

    if (!isShapeAPISupported && objects?.filter) {
      return objects.filter(object => object?.importType !== ObjectImportType.IMAGE);
    }

    return objects;
  };

  /**
 * Filters out formatted table objects if insertWorksheetsFromBase64() api is not supported in current version in order to maintain the backward compatibility.
 *
 * @param objects
 * @returns objects object definitions from excel document
 */
  filterFormattedTableObjects = (objects: ObjectData[]): ObjectData[] => {
    const { isInsertWorksheetAPISupported } = this.reduxStore.getState().officeReducer;

    if (!isInsertWorksheetAPISupported && objects?.filter) {
      return objects.filter(object => object?.importType !== ObjectImportType.FORMATTED_TABLE);
    }

    return objects;
  };

  /**
   * Set object's isPrompted flag to true if the dossier has prompt answers in the definition
   * and in the manipulationsXML properties, but isPrompted is false, and promptsAnswers is null.
   * This overrides the isPrompted flag, which was set to false in the previous version of the plugin even if
   * the dossier was prompted because it was loaded in consumption mode, and the user never had a chance to answer
   * the prompts or re-prompt the dossier to change the answers (it retained shortcut values).
   * @param object Restored object definition from excel document.
   */
  resetIsPromptedForDossierWithAnswers = (object: ObjectData): void => {
    if (object && object.mstrObjectType.type === 55 && !object.isPrompted) {
      object.isPrompted = object.manipulationsXML?.promptAnswers !== undefined;
    }
  };

  /**
   * Set object's 'importType' to 'TABLE' if it is not defined.
   * @param object Restored object definition from excel document.
   */
  assignImportTypeToObject = (object: ObjectData): void => {
    if (object && !object.importType) {
      object.importType = ObjectImportType.TABLE;
    }
  };

  /**
   * Set worksheet and groupData props of the object if not already defined.
   * Currently, if the worksheet has been deleted, we still retain the object but clear worksheet props.
   * @param object Restored object definition from excel document.
   */
  assignWorksheetAndGroupDataToObject = async (object: ObjectData): Promise<void> => {
    const excelContext = await officeApiHelper.getExcelContext();
    const { worksheets } = excelContext.workbook;

    if (object && !object.worksheet) {
      const objectWorksheet = await officeApiHelper.getExcelSheetFromTable(
        excelContext,
        object.bindId
      );

      if (objectWorksheet) {
        const { name, id, position } = await officeApiDataLoader.loadExcelData(excelContext, [
          { object: objectWorksheet, key: 'name' },
          { object: objectWorksheet, key: 'id' },
          { object: objectWorksheet, key: 'position' },
        ]);
        object.worksheet = { id, name, index: position };
      }
    } else if (
      object &&
      object.worksheet &&
      (object.worksheet.index === undefined || object.worksheet.index === null)
    ) {
      const objectWorksheet = worksheets.getItemOrNullObject(object.worksheet.id);
      const { isNullObject, position } = await officeApiDataLoader.loadExcelData(excelContext, [
        { object: objectWorksheet, key: 'isNullObject' },
        { object: objectWorksheet, key: 'position' },
      ]);

      if (!isNullObject) {
        object.worksheet.index = position;
      } else {
        // Clear worksheet props if the worksheet has been deleted
        object.worksheet = { id: '', name: '', index: -1 };
      }
    }
    // Restore groupData related props
    if (!object.groupData) {
      const { worksheet: { index = -1, name = '' } = {} } = object;
      object.groupData = {
        key: index,
        title: name,
      };
    }
  };

  /**
   * Parse the objects, then reset and assign properties to the object based on its existing
   * properties in contrast to the newly expected properties.
   * This includes resetting/assigning isPrompted, importType, worksheet, and groupData.
   * @param objects Restored object definitions from excel document.
   */
  restoreLegacyObjectsWithNewProps = async (objects: ObjectData[]): Promise<void> => {
    for (const object of objects || []) {
      if (object) {
        this.resetIsPromptedForDossierWithAnswers(object);
        this.assignImportTypeToObject(object);
        await this.assignWorksheetAndGroupDataToObject(object);
      }
    }
  };

  /**
   * Retrieves information about prompts answers imported in previous versions.
   * It fetches the information from Office Settings and stores it in Redux store.
   */
  restoreAnswersFromExcelStore = (): void => {
    const settings = officeStoreHelper.getOfficeSettings();
    const answers = settings.get(OfficeSettingsEnum.storedAnswers) || [];
    // If answers happens to be an empty array then it is still necessary
    // to dispatch it to clear the answers in Redux store.
    // @ts-expect-error
    this.reduxStore.dispatch(restoreAllAnswers(answers));
  };

  /**
   * Maps previously stored objects information to new format of data
   *
   * @param objects Objects imported in previous version of plugin
   * @param settings Office settings that is required in order to use Office Api
   * @return New objects and old objects converted to new format of data
   */
  restoreLegacyObjectsFromExcelStore = (
    settings: Office.Settings,
    objects: ObjectData[] = []
  ): ObjectData[] => {
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

          currentObject.objectWorkingId = Date.now() + index * reportArray.length;
          objectsToBeAdded.push(currentObject);
        }
      }
      settings.set(OfficeSettingsEnum.loadedReportProperties, []);
      settings.saveAsync(saveAsync =>
        console.info(`Clearing report Array in settings ${saveAsync.status}`)
      );
    }
    return [...objects, ...objectsToBeAdded];
  };

  /**
   * Maps values from legacy object to new key used in new data format
   *
   * @param object Object imported in previous version of plugin
   * @param newKey New name of the field
   * @param oldKey Old name of the field
   */
  mapLegacyObjectValue = (object: any, newKey: string, oldKey: string): void => {
    if (object[oldKey]) {
      object[newKey] = object[oldKey];
      delete object[oldKey];
    }
  };

  /**
   * Retrieves list of objects imported in previous versions,
   *
   * @return Contains legacy objects data
   * @throws Error on failed execution of Office api function
   */
  getLegacyObjectsList = (): any[] => {
    try {
      const settings = officeStoreHelper.getOfficeSettings();
      if (!settings.get(OfficeSettingsEnum.loadedReportProperties)) {
        settings.set(OfficeSettingsEnum.loadedReportProperties, []);
        settings.saveAsync();
      }
      return settings.get(OfficeSettingsEnum.loadedReportProperties);
    } catch (error) {
      errorService.handleError(error);
    }
  };

  /**
   * Retrieves one setting from Excel,
   * @param key
   * @return Contains settings value
   * @throws Error on failed execution of Office api function
   */
  getExcelSettingValue = (key: string): any => {
    const settings = officeStoreHelper.getOfficeSettings();
    return settings.get(key);
  };
}

const officeStoreRestoreObject = new OfficeStoreRestoreObject();
export default officeStoreRestoreObject;
