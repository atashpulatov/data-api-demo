import officeStoreHelper from './office-store-helper';

import { errorService } from '../../error/error-handler';
import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { officeContext } from '../office-context';
import { objectImportType } from '../../mstr-object/constants';

class OfficeStoreObject {
  init = reduxStore => {
    this.reduxStore = reduxStore;
  };

  /**
   * Removes object from office settings based on passed objectWorkingId
   *
   */
  removeObjectInExcelStore = objectWorkingId => {
    try {
      const settings = officeStoreHelper.getOfficeSettings();
      if (objectWorkingId) {
        const storedObjects = settings.get(officeProperties.storedObjects);
        const indexOfReport = storedObjects.findIndex(
          report => report.objectWorkingId === objectWorkingId
        );
        if (indexOfReport !== -1) {
          storedObjects.splice(indexOfReport, 1);
          settings.set(officeProperties.storedObjects, storedObjects);
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
  removeObjectFromStore = objectWorkingId => {
    this.reduxStore.dispatch(removeObject(objectWorkingId));
    this.removeObjectInExcelStore(objectWorkingId);
  };

  /**
   * Prepares objects before saving in Office Settings. It merges objects from redux with image objects from Office Store
   * if Shape API is not supported and image objects are present in Office Store.
   *
   * @returns {Array} Contains objects definitions from excel document
   */
  mergeReduxAndExcelStoreObjectsIfNoShapeAPI = () => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const isShapeAPISupported = officeContext.isShapeAPISupported();

    if (!isShapeAPISupported && objects?.length > 0) {
      // Restore objects from Office Store that contain image objects.
      const settings = officeStoreHelper.getOfficeSettings();
      const objectsInOfficeStore = settings.get(officeProperties.storedObjects);

      if (objectsInOfficeStore?.length > 0) {
        // Grab image objects from Office Store
        const imageObjects = objectsInOfficeStore.filter(object => object?.importType === objectImportType.IMAGE);

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
  saveObjectsInExcelStore = async () => {
    // Make sure that objects are merged before saving in Office Settings
    // to maintain backward compatibility and include image objects if Shape API is not supported.
    const objects = this.mergeReduxAndExcelStoreObjectsIfNoShapeAPI();
    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(officeProperties.storedObjects, objects);
    await settings.saveAsync();
  };

  /**
   * Saves current answers list from Answer Reducer in Office Settings
   *
   */
  saveAnswersInExcelStore = async () => {
    const { answers } = this.reduxStore.getState().answersReducer;
    const settings = officeStoreHelper.getOfficeSettings();
    settings.set(officeProperties.storedAnswers, answers);
    await settings.saveAsync();
  };
}

const officeStoreObject = new OfficeStoreObject();
export default officeStoreObject;
