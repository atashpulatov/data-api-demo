import { errorService } from '../../error/error-service';
import { officeApiHelper } from '../api/office-api-helper';
import officeReducerHelper from './office-reducer-helper';
import officeStoreHelper from './office-store-helper';

import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { restoreAllAnswers } from '../../redux-reducer/answers-reducer/answers-actions';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import officeApiDataLoader from '../api/office-api-data-loader';
import { OfficeSettingsEnum } from '../../constants/office-constants';
import { excludableObjectImportTypes, ObjectImportType } from '../../mstr-object/constants';

class OfficeStoreRestoreObject {
  /**
   * Transforms an array of objects by ensuring that the `promptsAnswers` property of each object is an array.
   * If an object is prompted, its `promptsAnswers` property is not an array, and its `mstrObjectType` is 55,
   * a new object is returned with the same properties as the original object,
   * but with `promptsAnswers` transformed into an array.
   * If an object does not meet these conditions, it is included in the returned array as is.
   *
   * @param objects - The array of objects to transform.
   * @returns The transformed array of objects.
   */
  restoreLegacyPromptedAnswersToArrayInDossiers = (objects: any[]): ObjectData[] =>
    objects.map((object: any) => {
      if (!object.promptsAnswers) {
        return { ...object, promptsAnswers: [] };
      }

      if (
        object.isPrompted &&
        !Array.isArray(object.promptsAnswers) &&
        object.mstrObjectType?.type === 55
      ) {
        return { ...object, promptsAnswers: [object.promptsAnswers] };
      }

      return object;
    });

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

    // Make sure previously saved prompted objects have `promptsAnswers` as an array
    // for dossier objects only.
    objects = this.restoreLegacyPromptedAnswersToArrayInDossiers(objects);

    await this.restoreLegacyObjectsWithNewProps(objects);

    settings.set(OfficeSettingsEnum.storedObjects, objects);

    // Do filter out objects if the corresponding excel api to import type is not supported.
    // Only reflect updated objects in redux store and not back into office store.
    excludableObjectImportTypes.forEach(objectImportType => {
      objects = this.excludeObjects(objects, objectImportType);
    });

    objects && reduxStore.dispatch(restoreAllObjects(objects));
  };

  /**
   * Filters out objects given excel api is not supported in current version in order to maintain the backward compatibility.
   *
   * @param isExcelApiSupported Indicated whether given excel api is supported
   * @param objects Objects stored in office settings
   * @param importType Type of the import that is being made
   *
   * @returns Contains the objects object definitions from excel document
   */
  excludeObjects = (objects: ObjectData[], objectImportType: ObjectImportType): ObjectData[] => {
    const isExcelApiSupported = officeReducerHelper.checkExcelApiSupport(objectImportType);

    if (!isExcelApiSupported) {
      return objects.filter(object => object?.importType !== objectImportType);
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
      const { worksheet: { id = '', name = '', index = -1 } = {} } = object;
      object.groupData = {
        key: id,
        title: name,
        index,
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

    reduxStore.dispatch(restoreAllAnswers(answers));
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
}

const officeStoreRestoreObject = new OfficeStoreRestoreObject();
export default officeStoreRestoreObject;
