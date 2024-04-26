import { PageByRefreshFailedOptions, PopupTypes } from '@mstr/connector-components';

import { officeApiHelper } from '../../office/api/office-api-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { pageByHelper } from '../../page-by/page-by-helper';
import { sidePanelHelper } from './side-panel-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import { calculateLoadingProgress } from '../../operation/operation-loading-progress';
import { OperationTypes } from '../../operation/operation-type-names';
import { updateOperation } from '../../redux-reducer/operation-reducer/operation-actions';
import { ObjectImportType } from '../../mstr-object/constants';

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
        sidePanelHelper.duplicateObject(objectWorkingId, !isActiveCellOptionSelected, false);
        closePopup();
      },
      onEdit: (isActiveCellOptionSelected: boolean): void => {
        sidePanelHelper.duplicateObject(objectWorkingId, !isActiveCellOptionSelected, true);
        closePopup();
      },
      onClose: closePopup,
    });
  }

  /**
   * Filters an array of loaded object data to retrieve objects associated with a specific page by link ID.
   *
   * @param loadedObjects An array of ObjectData containing loaded objects.
   * @param pageByLinkId The ID of the page by link to filter objects for.
   * @returns An array of ObjectData filtered by the provided page by link ID.
   */
  getObjectsByPageByLinkId = (loadedObjects: ObjectData[], pageByLinkId: string): ObjectData[] =>
    loadedObjects.filter(object => object.pageByData?.pageByLinkId === pageByLinkId);

  /**
   * Sets up a popup to refresh all pages associated with the provided pageByLinkId.
   *
   * @param data - Data required to create and update the refresh all pages popup.
   * @param data.setSidePanelPopup - Callback function to save the popup in the state of RightSidePanel.
   * @param data.pageByLinkId - The pageByLinkId used to identify the objects to refresh.
   * @param data.objects - An array of ObjectData representing all loaded objects.
   */
  setRefreshAllPagesPopup = ({
    setSidePanelPopup,
    pageByLinkId,
    objects,
  }: {
    setSidePanelPopup: Function;
    pageByLinkId: string;
    objects: ObjectData[];
  }): void => {
    const currentObjects = this.getObjectsByPageByLinkId(objects, pageByLinkId);

    if (currentObjects.length === 1) {
      pageByHelper.handleRefreshingMultiplePages(currentObjects[0].objectWorkingId);
    } else {
      setSidePanelPopup({
        type: PopupTypes.REFRESH_ALL_PAGES,
        onRefresh: () => {
          pageByHelper.handleRefreshingMultiplePages(currentObjects[0].objectWorkingId);
          setSidePanelPopup(null);
        },
        onClose: () => setSidePanelPopup(null),
        selectedObjects: currentObjects,
      });
    }
  };

  /**
   * Sets up a popup to delete all pages with the provided data.
   *
   * @param data - Data required to create and update the delete all pages popup.
   * @param data.setSidePanelPopup - Callback function to save the popup in the state of RightSidePanel.
   * @param data.pageByLinkId - The pageByLinkId used to identify the objects to delete.
   * @param data.objects - An array of ObjectData representing the current objects.
   */
  setDeleteAllPagesPopup = ({
    setSidePanelPopup,
    pageByLinkId,
    objects,
  }: {
    setSidePanelPopup: Function;
    pageByLinkId: string;
    objects: ObjectData[];
  }): void => {
    const currentObjects = this.getObjectsByPageByLinkId(objects, pageByLinkId);

    if (currentObjects.length === 1) {
      pageByHelper.handleRemovingMultiplePages(currentObjects[0].objectWorkingId);
    } else {
      setSidePanelPopup({
        type: PopupTypes.DELETE_ALL_PAGES,
        onDelete: () => {
          pageByHelper.handleRemovingMultiplePages(currentObjects[0].objectWorkingId);
          setSidePanelPopup(null);
        },
        onClose: () => setSidePanelPopup(null),
        selectedObjects: currentObjects,
      });
    }
  };

  /**
   * Creates or updates range taken popup.
   * Saves the popup and the objectWorkingId in state of RightSidePanel.
   * Called after value in redux is changed
   *
   * @param data  Data required to create and update range taken popup.
   * @param data.objectWorkingId  Uniqe id of source object for duplication.
   * @param data.activeCellAddress  Adress of selected cell in excel.
   * @param data.callback  Callback to cancel operation
   */
  setRangeTakenPopup = ({
    objectWorkingId,
    activeCellAddress,
    setSidePanelPopup,
    callback,
  }: {
    objectWorkingId: number;
    activeCellAddress: string;
    setSidePanelPopup: Function;
    callback: () => () => Promise<void>;
  }): void => {
    const onCancel = (): void => {
      this.clearPopupDataAndRunCallback(callback);
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
  };

  /**
   * Creates or updates pageby refresh failed popup.
   * Saves the popup and the objectWorkingId in state of RightSidePanel.
   * Called after value in redux is changed
   *
   * @param data  Data required to create and update pageby refresh failed popup.
   * @param data.objectWorkingId  Uniqe id of source object for duplication.
   * @param data.selectedObjects  List of objects to be displayed in the popup.
   * @param data.callback  Callback to cancel operation
   * @param data.setSidePanelPopup Callback to save popup in state of RightSidePanel.
   */
  setPageByRefreshFailedPopup = ({
    objectWorkingId,
    selectedObjects,
    setSidePanelPopup,
    callback,
    edit,
  }: {
    objectWorkingId: number;
    selectedObjects: ObjectData[];
    setSidePanelPopup: Function;
    callback: () => Promise<void>;
    edit: (objectWorkingId: number) => void;
  }): void => {
    const onCancel = (): void => {
      this.clearPopupDataAndRunCallback(callback);
    };

    const onOk = (refreshFailedOptions: PageByRefreshFailedOptions): void => {
      this.clearPopupDataAndRunCallback(callback);
      switch (refreshFailedOptions) {
        case PageByRefreshFailedOptions.EDIT_AND_REIMPORT:
          edit(objectWorkingId);
          break;
        case PageByRefreshFailedOptions.DELETE_FROM_WORKSHEET:
          pageByHelper.handleRemovingMultiplePages(objectWorkingId);
          break;
        default:
          break;
      }
    };

    setSidePanelPopup({
      type: PopupTypes.FAILED_TO_REFRESH_PAGES,
      selectedObjects,
      onOk: (refreshFailedOptions: PageByRefreshFailedOptions): void => onOk(refreshFailedOptions),
      onClose: onCancel,
    });
  };

  /**
   * Creates pageby import failed popup.
   *
   * @param data  Data required to create and update pageby refresh failed popup.
   * @param data.objectWorkingId  Uniqe id of source object for duplication.
   * @param data.setSidePanelPopup Callback to save popup in state of RightSidePanel.
   * @param data.errorDetails  Details of the error that occurred during import.
   */
  setPageByImportFailedPopup = ({
    objectWorkingId,
    setSidePanelPopup,
    errorDetails,
  }: {
    objectWorkingId: number;
    setSidePanelPopup: Function;
    errorDetails: string;
  }): void => {
    const onOk = (): void => {
      officeReducerHelper.clearPopupData();
      sidePanelHelper.revertPageByImport(objectWorkingId);
    };

    setSidePanelPopup({
      type: PopupTypes.FAILED_TO_IMPORT,
      errorDetails,
      onOk,
    });
  };

  /**
   * Clears the rendered popup data and runs the provided callback.
   *
   * @param callback Callback to run after clearing the popup data.
   */
  clearPopupDataAndRunCallback = (callback: () => void): void => {
    officeReducerHelper.clearPopupData();
    callback();
  };

  /**
   * Dispatches new data to redux in order to repeat step of the operation.
   *
   * @param objectWorkingId  Uniqe id of source object for duplication.
   * @param activeCellAddress  Adress of selected cell in excel.
   * @param insertNewWorksheet  specify if the object will be imported on new worksheet
   */
  importInNewRange = (
    objectWorkingId: number,
    activeCellAddress: string,
    insertNewWorksheet: boolean
  ): void => {
    this.reduxStore.dispatch(
      updateOperation({
        objectWorkingId,
        startCell: insertNewWorksheet ? 'A1' : activeCellAddress,
        repeatStep: true,
        tableChanged: true,
        insertNewWorksheet,
      })
    );
  };

  /**
   * Displays one of the 2 popup for clear data based on the values in redux store.
   *
   * @returns Contains type and callback for the popup
   */
  setClearDataPopups = (handleViewData: () => void): any => {
    let popup = null;

    const { isSecured, isClearDataFailed } = this.reduxStore.getState().officeReducer;
    isSecured &&
      (popup = {
        type: PopupTypes.DATA_CLEARED,
        onViewData: handleViewData,
      });
    isClearDataFailed &&
      (popup = {
        type: PopupTypes.DATA_CLEARED_FAILED,
        onViewData: handleViewData,
      });
    return popup;
  };

  /**
   * Displays notifications on the objects tiles
   *
   * @param loadedObjects  Contains all object currently existing in redux
   * @param notifications  Contains data of all notifications to be displayed
   * @param operations  Contains data of all currently existing operation
   */
  injectNotificationsToObjects = (
    loadedObjects: ObjectData[],
    notifications: any[],
    operations: OperationData[]
  ): ObjectData[] =>
    loadedObjects.map(object => {
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

  /**
   * Determines whether the progress percentages should be displayed based on the type of the operation
   *
   * @param objectOperation Data about operation running on specific object
   * @return specify whether progress percentages should be displayed
   */
  shouldGenerateProgressPercentage = (objectOperation: OperationData): boolean =>
    objectOperation &&
    objectOperation.operationType !== OperationTypes.REMOVE_OPERATION &&
    objectOperation.operationType !== OperationTypes.CLEAR_DATA_OPERATION &&
    objectOperation.operationType !== OperationTypes.HIGHLIGHT_OPERATION;
}

export const sidePanelNotificationHelper = new SidePanelNotificationHelper();
