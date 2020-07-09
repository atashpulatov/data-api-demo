import { popupTypes } from '@mstr/rc';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import { updateOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { calculateLoadingProgress } from '../operation/operation-loading-progress';
import { REMOVE_OPERATION, CLEAR_DATA_OPERATION, HIGHLIGHT_OPERATION } from '../operation/operation-type-names';
import { errorService } from '../error/error-handler';
import { notificationService } from '../notification-v2/notification-service';
import { authenticationHelper } from '../authentication/authentication-helper';
import { incomingErrorStrings } from '../error/constants';
import { homeHelper } from '../home/home-helper';
import { sidePanelService } from './side-panel-service';

const CONNECTION_CHECK_TIMEOUT = 3000;

class SidePanelNotificationHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
    this.popupTypes = popupTypes;
  };

  /**
   * Creates or updates duplicate popup.
   * Saves the popup and the objectWorkingId in state of RightSidePanel.
   * Called after user click on duplicate icon or after the activeCellAddress changed, while popup was opened.
   *
   * @param {Object} data - Data required to create and update duplicate popup.
   * @param {Number} data.objectWorkingId - Uniqe id of source object for duplication.
   * @param {String} data.activeCellAddress - Adress of selected cell in excel.
   * @param {Function} data.setSidePanelPopup - Callback to save popup in state of RightSidePanel.
   * @param {Function} data.setDuplicatedObjectId - Callback to save objectWorkingId in state of RightSidePanel.
   */
  setDuplicatePopup = ({
    objectWorkingId, activeCellAddress, setSidePanelPopup, setDuplicatedObjectId
  }) => {
    const closePopup = () => {
      setSidePanelPopup(null);
      setDuplicatedObjectId(null);
    };
    setDuplicatedObjectId(objectWorkingId);
    setSidePanelPopup({
      type: this.popupTypes.DUPLICATE,
      activeCell: officeApiHelper.getCellAddressWithDollars(activeCellAddress),
      onImport: (isActiveCellOptionSelected) => {
        sidePanelService.duplicate(objectWorkingId, !isActiveCellOptionSelected, false);
        closePopup();
      },
      onEdit: (isActiveCellOptionSelected) => {
        sidePanelService.duplicate(objectWorkingId, !isActiveCellOptionSelected, true);
        closePopup();
      },
      onClose: closePopup
    });
  };

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
  setRangeTakenPopup = ({
    objectWorkingId, activeCellAddress, setSidePanelPopup, callback
  }) => {
    const onCancel = () => {
      this.reduxStore.dispatch(officeActions.clearSidePanelPopupData());
      callback();
      setSidePanelPopup(null);
    };


    setSidePanelPopup({
      type: this.popupTypes.RANGE_TAKEN,
      activeCell: officeApiHelper.getCellAddressWithDollars(activeCellAddress),
      onOk: (isActiveCellOptionSelected) => {
        this.importInNewRange(objectWorkingId, activeCellAddress, !isActiveCellOptionSelected);
        this.reduxStore.dispatch(officeActions.clearSidePanelPopupData());
        setSidePanelPopup(null);
      },
      onCancel,
      onClose: onCancel
    });
  };

  /**
   * Dispatches new data to redux in order to repeat step of the operation.
   *
   * @param {Number} objectWorkingId  Uniqe id of source object for duplication.
   * @param {String} activeCellAddress  Adress of selected cell in excel.
   * @param {Boolean} insertNewWorksheet  specify if the object will be imported on new worksheet
   */
  importInNewRange = (objectWorkingId, activeCellAddress, insertNewWorksheet) => {
    this.reduxStore.dispatch(updateOperation({
      objectWorkingId,
      startCell: activeCellAddress,
      repeatStep: true,
      tableChanged: true,
      insertNewWorksheet,
    }));
  }

  /**
   * Displays one of the 2 popup for clear data based on the values in redux store.
   *
   * @returns {Object} Contains type and callback for the popup
   */
  setClearDataPopups = () => {
    let popup = null;

    const { isSecured, isClearDataFailed } = this.reduxStore.getState().officeReducer;
    isSecured && (popup = {
      type: this.popupTypes.DATA_CLEARED,
      onViewData: this.handleViewData,
    });
    isClearDataFailed && (popup = {
      type: this.popupTypes.DATA_CLEARED_FAILED,
      onViewData: this.handleViewData,
    });
    return popup;
  };

  /**
   * Toggles flags for cleardata and refresh all existing objects.
   */
   handleViewData = async () => {
     try {
       await officeApiHelper.checkStatusOfSessions();
       this.reduxStore.dispatch(officeActions.toggleSecuredFlag(false));
       this.reduxStore.dispatch(officeActions.toggleIsClearDataFailedFlag(false));
       sidePanelService.refresh(officeReducerHelper.getObjectsListFromObjectReducer()
         .map(({ objectWorkingId }) => objectWorkingId));
     } catch (error) {
       errorService.handleError(error);
     }
   };

  /**
   * Displays notifications on the objects tiles
   *
   * @param {Array} loadedObjects  Contains all object currently existing in redux
   * @param {Array} notifications  Contains data of all notifications to be displayed
   * @param {Array} operations  Contains data of all currently existing operation
   */
  injectNotificationsToObjects = (loadedObjects, notifications, operations) => loadedObjects.map((object) => {
    const objectOperation = operations.find((operation) => operation.objectWorkingId === object.objectWorkingId);
    const objectNotificationData = notifications.find(
      (notification) => notification.objectWorkingId === object.objectWorkingId
    );

    const operationBasedNotificationData = this.shouldGenerateProgressPercentage(objectOperation)
      ? {
        percentageComplete: objectOperation.totalRows ? calculateLoadingProgress(objectOperation) : 0,
        itemsTotal: !objectNotificationData.isFetchingComplete ? objectOperation.totalRows : 0,
        itemsComplete: !objectNotificationData.isFetchingComplete ? objectOperation.loadedRows : 0,
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

  /**
   * Determines whether the progress percentages should be displayed based on the type of the operation
   *
   * @param {Object} objectOperation Data about operation running on specific object
   * @return {Boolean} specify whether progress percentages should be displayed
   */
  shouldGenerateProgressPercentage = (objectOperation) => objectOperation
  && objectOperation.operationType !== REMOVE_OPERATION
  && objectOperation.operationType !== CLEAR_DATA_OPERATION
  && objectOperation.operationType !== HIGHLIGHT_OPERATION

  /**
   * Handles error thrown during invoking side panel actions like refresh, edit etc.
   * For Webkit based clients (Safari, Excel for Mac)
   * it checks for network connection with custom implementation
   * This logic allows us to provide user with connection lost notification
   *
   * @param {Object} error Plain error object thrown by method calls.
   */
  handleSidePanelActionError = (error) => {
    const castedError = String(error);
    const { CONNECTION_BROKEN } = incomingErrorStrings;
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
  connectionCheckerLoop = () => {
    const checkInterval = setInterval(() => {
      authenticationHelper.doesConnectionExist(checkInterval);
    }, CONNECTION_CHECK_TIMEOUT);
  }
}

export const sidePanelNotificationHelper = new SidePanelNotificationHelper();
