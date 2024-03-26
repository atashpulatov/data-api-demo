import officeStoreHelper from './office-store-helper';

import { ReduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { errorService } from '../../error/error-handler';
import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import { officeContext } from '../office-context';
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
   * Prepares objects before saving in Office Settings. It merges objects from redux with image objects from Office Store
   * if Shape API is not supported and image objects are present in Office Store.
   *
   * @returns {Array} Contains objects definitions from excel document
   */
  mergeReduxToExcelStoreObjectsIfShapeApiNotSupported = (): ObjectData[] => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const isShapeAPISupported = officeContext.isShapeAPISupported();

    if (!isShapeAPISupported) {
      // Restore objects from Office Store that contain image objects.
      const settings = officeStoreHelper.getOfficeSettings();
      const objectsInOfficeStore: ObjectData[] = settings.get(OfficeSettingsEnum.storedObjects);

      if (objectsInOfficeStore?.length > 0) {
        // Grab image objects from Office Store
        const imageObjects = objectsInOfficeStore.filter(
          object => object?.importType === ObjectImportType.IMAGE
        );

        // Merge imageObjects with objects from redux based and sort descendng on objectWorkingId property in object.
        if (imageObjects?.length > 0) {
          return objects.concat(imageObjects).sort((a, b) => b.objectWorkingId - a.objectWorkingId);
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
    const objects = this.mergeReduxToExcelStoreObjectsIfShapeApiNotSupported();
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
