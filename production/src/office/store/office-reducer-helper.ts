import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import { OperationTypes } from '../../operation/operation-type-names';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { ObjectImportType } from '../../mstr-object/constants';

class OfficeReducerHelper {
  reduxStore: any;

  init(reduxStore: any): void {
    this.reduxStore = reduxStore;

    this.getObjectFromObjectReducerByObjectWorkingId =
      this.getObjectFromObjectReducerByObjectWorkingId.bind(this);
  }

  /**
   * Function return array of objects from objects reducer
   *
   * @return  Contains all currently existing objects
   */
  getObjectsListFromObjectReducer = (): ObjectData[] => {
    const state = this.reduxStore.getState();
    const { objects } = state.objectReducer;

    return objects;
  };

  /**
   * Function return array of operations from operation reducer, excluding highlight operation
   *
   * @return Contains all currently existing operations
   */
  getOperationsListFromOperationReducer = (): OperationData[] =>
    this.reduxStore
      .getState()
      .operationReducer.operations.filter(
        (operation: OperationData) => operation.operationType !== OperationTypes.HIGHLIGHT_OPERATION
      );

  /**
   * Checks if there are any existing operation in operation reducer
   * return false if number of operations bigger than 0
   * return true if number of operations is equal 0
   *
   * @return  Specify if there is no operation in the operation reducer
   */
  noOperationInProgress = (): boolean => this.getOperationsListFromOperationReducer().length === 0;

  /**
   * Return object from object Reducer correspongin to passed bindId
   *
   * @param  bindId Id of the Office table created on import used for referencing the Excel table
   * @return
   */
  getObjectFromObjectReducerByBindId = (bindId: string): ObjectData => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find((object: ObjectData) => object.bindId === bindId);
  };

  /**
   * Return object from object Reducer corresponding to passed objectWorkingId
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @return
   */
  getObjectFromObjectReducerByObjectWorkingId(objectWorkingId: number): ObjectData {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find((object: ObjectData) => object.objectWorkingId === objectWorkingId);
  }

  /**
   * Return notification from notification Reducer corresponding to passed objectWorkingId
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   * @return {Object}
   */
  getNotificationFromNotificationReducer = (objectWorkingId: number): any => {
    const { notifications } = this.reduxStore.getState().notificationReducer;
    return notifications.find(
      (notification: any) => notification.objectWorkingId === objectWorkingId
    );
  };

  /**
   * Set popup data in office reducer. Based on this data will display the popup.
   *
   * @param popupData Contains data about popup to be displayed
   */
  displayPopup = (popupData: any): void => {
    this.reduxStore.dispatch(officeActions.setPopupData(popupData));
  };

  /**
   * Clear popup data in office reducer. Based on this data will hide the popup.
   *
   */
  clearPopupData = (): void => {
    this.reduxStore.dispatch(officeActions.clearPopupData());
  };

  /**
   * Performs excel api version check and identifies the excel api support 
   * in current version based on import type.
   * 
   * @param importType Type of the import that is being made
   * 
   * @return Flag indicating whether correspoding excel api to import type is supported
   */
  identifyExcelApiSupport = (objectImportType: ObjectImportType): boolean => {
    const { isShapeAPISupported, isInsertWorksheetAPISupported } = this.reduxStore.getState().officeReducer;

    let isExcelApiSupported: boolean;

    switch (objectImportType) {
      case ObjectImportType.IMAGE:
        isExcelApiSupported = isShapeAPISupported;
        break;
      case ObjectImportType.FORMATTED_TABLE:
        isExcelApiSupported = isInsertWorksheetAPISupported;
        break;
      default:
        isExcelApiSupported = true;
    }

    return isExcelApiSupported;
  }
}

const officeReducerHelper = new OfficeReducerHelper();
export default officeReducerHelper;
