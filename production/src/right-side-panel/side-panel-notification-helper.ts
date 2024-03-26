import { PopupTypes } from '@mstr/connector-components';

import { authenticationHelper } from '../authentication/authentication-helper';
import { homeHelper } from '../home/home-helper';
import { notificationService } from '../notification/notification-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { sidePanelService } from './side-panel-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import { errorService } from '../error/error-handler';
import { calculateLoadingProgress } from '../operation/operation-loading-progress';
import { OperationTypes } from '../operation/operation-type-names';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { updateOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { IncomingErrorStrings } from '../error/constants';
import { ObjectImportType } from '../mstr-object/constants';

const CONNECTION_CHECK_TIMEOUT = 3000;

class SidePanelNotificationHelper {
  reduxStore: any;

  init(reduxStore: any): void {
    this.reduxStore = reduxStore;
  }

  /**
   * Creates or updates duplicate popup.
   * Saves the popup and the objectWorkingId in state of RightSidePanel.
   * Called after user click on duplicate icon or after the activeCellAddress changed, while popup was opened.
   *
   * @param data - Data required to create and update duplicate popup.
   * @param data.objectWorkingId - Uniqe id of source object for duplication.
   * @param data.activeCellAddress - Adress of selected cell in excel.
   * @param data.setSidePanelPopup - Callback to save popup in state of RightSidePanel.
   * @param data.setDuplicatedObjectId - Callback to save objectWorkingId in state of RightSidePanel.
   */
  setDuplicatePopup({
    objectWorkingId,
    activeCellAddress,
    setSidePanelPopup,
    setDuplicatedObjectId,
  }: {
    objectWorkingId: number;
    activeCellAddress: string;
    setSidePanelPopup: Function;
    setDuplicatedObjectId: Function;
  }): void {
    const closePopup = (): void => {
      setSidePanelPopup(null);
      setDuplicatedObjectId(null);
    };
    setDuplicatedObjectId(objectWorkingId);
    setSidePanelPopup({
      type: PopupTypes.DUPLICATE,
      activeCell: officeApiHelper.getCellAddressWithDollars(activeCellAddress),
      onImport: (isActiveCellOptionSelected: boolean): void => {
        sidePanelService.duplicate(objectWorkingId, !isActiveCellOptionSelected, false);
        closePopup();
      },
      onEdit: (isActiveCellOptionSelected: boolean): void => {
        sidePanelService.duplicate(objectWorkingId, !isActiveCellOptionSelected, true);
        closePopup();
      },
      onClose: closePopup,
    });
  }

  /**
   * Creates or updates range taken popup.
   * Saves the popup and the objectWorkingId in state of RightSidePanel.
   * Called after value in redux is changed
   *
   * @param {Object} data  Data required to create and update range taken popup.
   * @param {Number} data.objectWorkingId  Uniqe id of source object for duplication.
   * @param {String} data.activeCellAddress  Adress of selected cell in excel.
   * @param {Function} data.callback  Callback to cancel operation
   */
  setRangeTakenPopup({
    objectWorkingId,
    activeCellAddress,
    setSidePanelPopup,
    callback,
  }: {
    objectWorkingId: number;
    activeCellAddress: string;
    setSidePanelPopup: Function;
    callback: Function;
  }): void {
    const onCancel = (): void => {
      officeReducerHelper.clearPopupData();
      callback();
    };

    setSidePanelPopup({
      type: PopupTypes.RANGE_TAKEN,
      activeCell: officeApiHelper.getCellAddressWithDollars(activeCellAddress),
      onOk: (isActiveCellOptionSelected: boolean): void => {
        this.importInNewRange(objectWorkingId, activeCellAddress, !isActiveCellOptionSelected);
        officeReducerHelper.clearPopupData();
      },
      onCancel,
      onClose: onCancel,
    });
  }

  /**
   * Dispatches new data to redux in order to repeat step of the operation.
   *
   * @param objectWorkingId  Uniqe id of source object for duplication.
   * @param activeCellAddress  Adress of selected cell in excel.
   * @param insertNewWorksheet  specify if the object will be imported on new worksheet
   */
  importInNewRange(
    objectWorkingId: number,
    activeCellAddress: string,
    insertNewWorksheet: boolean
  ): void {
    this.reduxStore.dispatch(
      updateOperation({
        objectWorkingId,
        startCell: insertNewWorksheet ? 'A1' : activeCellAddress,
        repeatStep: true,
        tableChanged: true,
        insertNewWorksheet,
      })
    );
  }

  /**
   * Displays one of the 2 popup for clear data based on the values in redux store.
   *
   * @returns Contains type and callback for the popup
   */
  setClearDataPopups(): any {
    let popup = null;

    const { isSecured, isClearDataFailed } = this.reduxStore.getState().officeReducer;
    isSecured &&
      (popup = {
        type: PopupTypes.DATA_CLEARED,
        onViewData: this.handleViewData,
      });
    isClearDataFailed &&
      (popup = {
        type: PopupTypes.DATA_CLEARED_FAILED,
        onViewData: this.handleViewData,
      });
    return popup;
  }

  /**
   * Toggles flags for cleardata and refresh all existing objects.
   */
  async handleViewData(): Promise<void> {
    try {
      await officeApiHelper.checkStatusOfSessions();
      this.reduxStore.dispatch(officeActions.toggleSecuredFlag(false));
      this.reduxStore.dispatch(officeActions.toggleIsClearDataFailedFlag(false));
      sidePanelService.refresh(
        officeReducerHelper
          .getObjectsListFromObjectReducer()
          .map(({ objectWorkingId }) => objectWorkingId)
      );
    } catch (error) {
      errorService.handleError(error);
    }
  }

  /**
   * Displays notifications on the objects tiles
   *
   * @param loadedObjects  Contains all object currently existing in redux
   * @param notifications  Contains data of all notifications to be displayed
   * @param operations  Contains data of all currently existing operation
   */
  injectNotificationsToObjects(
    loadedObjects: ObjectData[],
    notifications: any[],
    operations: OperationData[]
  ): ObjectData[] {
    return loadedObjects.map(object => {
      const objectOperation = operations.find(
        operation => operation.objectWorkingId === object.objectWorkingId
      );
      const objectNotificationData = notifications.find(
        notification => notification.objectWorkingId === object.objectWorkingId
      );
      // Validate that isFetchingComplete is not undefined
      const operationBasedNotificationData = this.shouldGenerateProgressPercentage(objectOperation)
        ? {
            percentageComplete:
              objectOperation.totalRows || object.importType === ObjectImportType.IMAGE
                ? calculateLoadingProgress(objectOperation, object.importType)
                : 0,
            itemsTotal: !objectNotificationData?.isFetchingComplete ? objectOperation.totalRows : 0,
            itemsComplete: !objectNotificationData?.isFetchingComplete
              ? objectOperation.loadedRows
              : 0,
          }
        : {};

      let notification;
      if (objectNotificationData) {
        notification = {
          ...objectNotificationData,
          ...operationBasedNotificationData,
        };
      }

      return {
        ...object,
        notification,
      };
    });
  }

  /**
   * Determines whether the progress percentages should be displayed based on the type of the operation
   *
   * @param objectOperation Data about operation running on specific object
   * @return specify whether progress percentages should be displayed
   */
  shouldGenerateProgressPercentage(objectOperation: OperationData): boolean {
    return (
      objectOperation &&
      objectOperation.operationType !== OperationTypes.REMOVE_OPERATION &&
      objectOperation.operationType !== OperationTypes.CLEAR_DATA_OPERATION &&
      objectOperation.operationType !== OperationTypes.HIGHLIGHT_OPERATION
    );
  }

  /**
   * Handles error thrown during invoking side panel actions like refresh, edit etc.
   * For Webkit based clients (Safari, Excel for Mac)
   * it checks for network connection with custom implementation
   * This logic allows us to provide user with connection lost notification
   *
   * @param error Plain error object thrown by method calls.
   */
  handleSidePanelActionError(error: any): void {
    const castedError = String(error);
    const { CONNECTION_BROKEN } = IncomingErrorStrings;
    if (castedError.includes(CONNECTION_BROKEN)) {
      if (homeHelper.isMacAndSafariBased()) {
        notificationService.connectionLost();
        this.connectionCheckerLoop();
      }
      return;
    }
    errorService.handleError(error);
  }

  /**
   * This method creates an interval and checkes every CONNECTION_CHECK_TIMOUT seconds
   * whether the connection to the internet has been restored
   *
   */
  connectionCheckerLoop(): void {
    const checkInterval = setInterval(() => {
      authenticationHelper.doesConnectionExist(checkInterval);
    }, CONNECTION_CHECK_TIMEOUT);
  }
}

export const sidePanelNotificationHelper = new SidePanelNotificationHelper();
