import { HIGHLIGHT_OPERATION } from '../../operation/operation-type-names';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { objectImportType } from '../../mstr-object/constants';

class OfficeReducerHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
  * Function return array of objects from objects reducer
  *
  * @return {Array} Contains all currently existing objects
  */
  getObjectsListFromObjectReducer = () => {
    const state = this.reduxStore.getState();

    const { isShapeAPISupported } = state.officeReducer;
    const { objects } = state.objectReducer;

    let loadedObjects = [...objects];
    // Filter out the image objects if the shape api is not supported
    // in current version in order to maintain the backward compatibility.
    if (!isShapeAPISupported) {
      loadedObjects = loadedObjects.filter((object) => object?.importType !== objectImportType.IMAGE);
    }

    return loadedObjects;
  };

  /**
  * Function return array of operations from operation reducer, excluding highlight operation
  *
  * @return {Array} Contains all currently existing operations
  */
  getOperationsListFromOperationReducer = () => this.reduxStore.getState().operationReducer.operations.filter(
    operation => operation.operationType !== HIGHLIGHT_OPERATION
  );

  /**
  * Checks if there are any existing operation in operation reducer
  * return false if number of operations bigger than 0
  * return true if number of operations is equal 0
  *
  * @return {Boolean} Specify if there is no operation in the operation reducer
  */
  noOperationInProgress = () => this.getOperationsListFromOperationReducer().length === 0;

  /**
  * Return object from object Reducer correspongin to passed bindId
  *
  * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
  * @return {Object}
  */
  getObjectFromObjectReducerByBindId = (bindId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find((object) => object.bindId === bindId);
  };

  /**
  * Return object from object Reducer corresponding to passed objectWorkingId
  *
  * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
  * @return {Object}
  */
  getObjectFromObjectReducerByObjectWorkingId = (objectWorkingId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find(object => object.objectWorkingId === objectWorkingId);
  };

  /**
  * Return notification from notification Reducer corresponding to passed objectWorkingId
  *
  * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
  * @return {Object}
  */
  getNotificationFromNotificationReducer = (objectWorkingId) => {
    const { notifications } = this.reduxStore.getState().notificationReducer;
    return notifications.find(notification => notification.objectWorkingId === objectWorkingId);
  };

  /**
  * Set popup data in office reducer. Based on this data will display the popup.
  *
  * @param {Object} popupData Contains data about popup to be displayed
  */
  displayPopup = (popupData) => {
    this.reduxStore.dispatch(officeActions.setPopupData(popupData));
  };

  /**
  * Clear popup data in office reducer. Based on this data will hide the popup.
  *
  */
  clearPopupData = () => {
    this.reduxStore.dispatch(officeActions.clearPopupData());
  };
}

const officeReducerHelper = new OfficeReducerHelper();
export default officeReducerHelper;
