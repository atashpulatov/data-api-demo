import { errorService } from '../../error/error-service';
import officeReducerHelper from './office-reducer-helper';
import officeStoreHelper from './office-store-helper';

import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import { OfficeSettingsEnum } from '../../constants/office-constants';
import { excludableObjectImportTypes, ObjectImportType } from '../../mstr-object/constants';

class OfficeStoreObject {
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
    reduxStore.dispatch(removeObject(objectWorkingId));
    this.removeObjectInExcelStore(objectWorkingId);
  };

  /**
   * Merges previously filtered out objects to redux store to maintain backward compatibility.
   * Ultimately sorts concatenated objects by objectWorkingId.
   *
   * @param isExcelApiSupported Indicated whether given excel api is supported
   * @param objects Objects stored in office settings
   * @param importType Type of the import that is being made
   *
   * @returns Contains the objects definitions from excel document
   */
  mergeStoreObjectsToRedux = (objects: ObjectData[], objectImportType: ObjectImportType): any => {
    const isExcelApiSupported = officeReducerHelper.checkExcelApiSupport(objectImportType);

    if (!isExcelApiSupported) {
      const settings = officeStoreHelper.getOfficeSettings();
      const objectsInOfficeStore: ObjectData[] = settings.get(OfficeSettingsEnum.storedObjects);

      if (objectsInOfficeStore?.length > 0) {
        const filteredObjects = objectsInOfficeStore.filter(
          (object: any) => object?.importType === objectImportType
        );

        if (filteredObjects?.length > 0) {
          return objects
            .concat(filteredObjects)
            .sort((a: ObjectData, b: ObjectData) => b.objectWorkingId - a.objectWorkingId);
        }
      }
    }
    return objects;
  };

  /**
   * Saves current objects list from Object Reducer in Office Settings
   *
   */
  saveObjectsInExcelStore = (): void => {
    // Make sure that objects are merged before saving in Office Settings
    // to maintain backward compatibility and include image objects if Shape API is not supported.
    const { objects: objectsInRedux } = reduxStore.getState().objectReducer;

    let objects = [...objectsInRedux];

    // Restore hidden image objects before saving objects into office settings
    excludableObjectImportTypes.forEach(objectImportType => {
      objects = this.mergeStoreObjectsToRedux(objects, objectImportType);
    });

    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(OfficeSettingsEnum.storedObjects, objects);
    settings.saveAsync();
  };

  /**
   * Saves current answers list from Answer Reducer in Office Settings
   *
   */
  saveAnswersInExcelStore = (): void => {
    const { answers } = reduxStore.getState().answersReducer;
    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(OfficeSettingsEnum.storedAnswers, answers);
    settings.saveAsync();
  };
}

const officeStoreObject = new OfficeStoreObject();
export default officeStoreObject;
