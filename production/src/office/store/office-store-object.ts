import officeStoreHelper from './office-store-helper';

import { ReduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { errorService } from '../../error/error-handler';
import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import { OfficeSettingsEnum } from '../../constants/office-constants';
import { ObjectImportType } from '../../mstr-object/constants';

class OfficeStoreObject {
  reduxStore: ReduxStore;

  init(reduxStore: ReduxStore): void {
    this.reduxStore = reduxStore;
  }

  /**
   * Removes object from office settings based on passed objectWorkingId
   *
   */
  removeObjectInExcelStore = (objectWorkingId?: number): void => {
    try {
      const settings = officeStoreHelper.getOfficeSettings();
      if (objectWorkingId) {
        const storedObjects: ObjectData[] = settings.get(OfficeSettingsEnum.storedObjects);
        const indexOfObject = storedObjects.findIndex(
          object => object.objectWorkingId === objectWorkingId
        );
        if (indexOfObject !== -1) {
          storedObjects.splice(indexOfObject, 1);
          settings.set(OfficeSettingsEnum.storedObjects, storedObjects);
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
  removeObjectFromStore = (objectWorkingId: number): void => {
    // @ts-expect-error
    this.reduxStore.dispatch(removeObject(objectWorkingId));
    this.removeObjectInExcelStore(objectWorkingId);
  };

  /**
   * Merges filtered out image objects back to redux store to maintain backward compatibility.
   * 
   * NOTE: Method @link {OfficeStoreRestoreObject.filterImageObjects()} used for filtering out objects,
   * if Shape API is not supported before initializing redux store.
   *
   * @returns {Array} Contains objects definitions from excel document
   */
  mergeImageStoreObjectsToRedux = (objects: any): ObjectData[] => {
    const { isShapeAPISupported } = this.reduxStore.getState().officeReducer;

    if (!isShapeAPISupported) {
      this.mergeStoreObjectsToRedux(objects, ObjectImportType.IMAGE);
    }

    return objects;
  };

  /**
   * Merges filtered out formatted table objects back to redux store to maintain backward compatibility.
   * 
   * NOTE: Method @link {OfficeStoreRestoreObject.filterFormattedTableObjects()} used for filtering out objects,
   * if Excel.Workbook insertWorksheetsFromBase64() API is not supported before initializing redux store.
   * 
   * @returns {Array} Contains objects definitions from excel document
   */
  mergeFormattedTableStoreObjectsToRedux = (objects: any): ObjectData[] => {
    const { isInsertWorksheetAPISupported } = this.reduxStore.getState().officeReducer;

    if (!isInsertWorksheetAPISupported) {
      return this.mergeStoreObjectsToRedux(objects, ObjectImportType.FORMATTED_TABLE);
    }

    return objects;
  };

  /**
   * Merges filtered out objects to redux store. Ultimately sorts by objectWorkingId.
   * 
   * @returns {Array} Contains objects definitions from excel document
   */
  private mergeStoreObjectsToRedux = (objects: any, objectImportType: any): any => {
    const settings = officeStoreHelper.getOfficeSettings();
    const objectsInOfficeStore: ObjectData[] = settings.get(OfficeSettingsEnum.storedObjects);

    if (objectsInOfficeStore?.length > 0) {
      const filteredObjects = objectsInOfficeStore.filter(
        (object: any) => object?.importType === objectImportType
      );

      if (filteredObjects?.length > 0) {
        return objects.concat(filteredObjects).sort((a: { objectWorkingId: number; }, b: { objectWorkingId: number; }) => b.objectWorkingId - a.objectWorkingId);
      }
    }

    return objects;
  }

  /**
   * Saves current objects list from Object Reducer in Office Settings
   *
   */
  saveObjectsInExcelStore = (): void => {
    // Make sure that objects are merged before saving in Office Settings
    // to maintain backward compatibility and include image objects if Shape API is not supported.
    const { objects: objectsInRedux } = this.reduxStore.getState().objectReducer;

    let objects = [...objectsInRedux];
    // Restore hidden image objects before saving objects into office settings
    objects = this.mergeImageStoreObjectsToRedux(objects);

    // Restore hidden formatted table objects before saving objects into office settings
    objects = this.mergeFormattedTableStoreObjectsToRedux(objects);

    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(OfficeSettingsEnum.storedObjects, objects);
    settings.saveAsync();
  };

  /**
   * Saves current answers list from Answer Reducer in Office Settings
   *
   */
  saveAnswersInExcelStore = (): void => {
    const { answers } = this.reduxStore.getState().answersReducer;
    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(OfficeSettingsEnum.storedAnswers, answers);
    settings.saveAsync();
  };
}

const officeStoreObject = new OfficeStoreObject();
export default officeStoreObject;
