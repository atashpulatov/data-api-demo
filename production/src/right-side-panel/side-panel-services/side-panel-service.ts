import { ReactElement } from 'react';
import { PopupProps, SidePanelBannerStatus } from '@mstr/connector-components';
import { SidePanelBannerButtons } from '@mstr/connector-components/lib/side-panel/banner/side-panel-banner-buttons';
import { SidePanelBannerButtonTypes } from '@mstr/connector-components/lib/side-panel/banner/side-panel-banner-types';

import { errorService } from '../../error/error-service';
import { notificationService } from '../../notification/notification-service';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { officeShapeApiHelper } from '../../office/shapes/office-shape-api-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import officeStoreHelper from '../../office/store/office-store-helper';
import { popupHelper } from '../../redux-reducer/popup-reducer/popup-helper';
import { sidePanelHelper } from './side-panel-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';

import officeStoreObject from '../../office/store/office-store-object';
import { reduxStore } from '../../store';

import {
  SidePanelBanner,
  TitleOperationInProgressMap,
} from '../../redux-reducer/notification-reducer/notification-reducer-types';
import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import { dialogController } from '../../dialog/dialog-controller';
import i18n from '../../i18n';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { OperationTypes } from '../../operation/operation-type-names';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { setSidePanelBannerNotification } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { updateObject } from '../../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import {
  clearDataRequested,
  highlightRequested,
  refreshRequested,
  removeRequested,
} from '../../redux-reducer/operation-reducer/operation-actions';
import {
  addRepromptTask,
  executeNextRepromptTask,
} from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import sidePanelOperationDecorator from './side-panel-operation-decorator';
import { OfficeSettingsEnum } from '../../constants/office-constants';
import { ObjectImportType } from '../../mstr-object/constants';

export class SidePanelService {
  /**
   * Opens popup with table of objects
   * Prevent navigation tree from going straight into importing previously selected item.
   */
  @sidePanelOperationDecorator.operationWrapper
  async addData(): Promise<void> {
    // @ts-expect-error
    reduxStore.dispatch(navigationTreeActions.cancelImportRequest());
    await dialogController.runPopupNavigation();
  }

  /**
   * Handles the highlighting of object.
   * Creates highlight operation for specific objectWorkingId.
   *
   * @param objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  @sidePanelOperationDecorator.operationWrapper
  highlightObject(objectWorkingId: number): void {
    reduxStore.dispatch(highlightRequested(objectWorkingId));
  }

  /**
   * Handles the renaming of object.
   * Calls officeStoreObject.saveObjectsInExcelStore to modify name field in Object Data
   * for object corresponding to passed objectWorkingID
   *
   * @param objectWorkingId Unique Id of the object, allowing to reference source object.
   * @param newName New name for object
   */
  @sidePanelOperationDecorator.operationWrapper
  rename(objectWorkingId: number, newName: string): void {
    const renamedObject = { objectWorkingId, name: newName };
    reduxStore.dispatch(updateObject(renamedObject));
    officeStoreObject.saveObjectsInExcelStore();
  }

  /**
   * Generates the side panel banner buttons.
   * Consisted of only one button for stopping the refresh operation.
   *
   * @param title - string to show as message in banner
   * @param onClickHandler - handler to be called when button is clicked
   * @param tooltip - string to show as tooltip for the button
   * @returns
   */
  getSidePanelBannerButtons(
    title: string,
    onClickHandler: () => void,
    tooltip?: string
  ): ReactElement {
    return SidePanelBannerButtons({
      buttons: [
        { label: title, onClick: onClickHandler, type: SidePanelBannerButtonTypes.STOP, tooltip },
      ],
    });
  }

  /**
   * Shows the refresh in progress notification in the side panel.
   * Generates the handler objects and dispatches notification to the side panel.
   */
  showRefreshInProgressBanner(operations: OperationData[]): void {
    // Close banner notification handler
    const onDismissHandler = (): void => {
      reduxStore.dispatch(setSidePanelBannerNotification({ type: SidePanelBannerStatus.NONE }));
    };

    // Stop refresh all operation handler
    const onClickHandler = (): void => {
      reduxStore.dispatch(
        setSidePanelBannerNotification({
          title: i18n.t('Stopping...'),
          type: SidePanelBannerStatus.STOPPED,
        })
      );

      // Get current notifications and create a map for easy access
      const { notifications } = reduxStore.getState().notificationReducer;
      const notificationMap = notifications.reduce((map, notification) => {
        map.set(notification.objectWorkingId, notification);
        return map;
      }, new Map());

      if (notificationMap) {
        // Filter out the refresh operations and cancel the corresponding notification
        // only if the notification associated with the operation is in pending state.
        operations
          ?.filter(operation => operation.operationType === OperationTypes.REFRESH_OPERATION)
          .forEach((operation: OperationData) => {
            const { operationId, objectWorkingId } = operation;
            const operationNotification = notificationMap.get(objectWorkingId);
            // Cancel the operation only if its notification is in pending state
            if (
              operationNotification?.objectWorkingId === objectWorkingId &&
              operationNotification.title === TitleOperationInProgressMap.PENDING_OPERATION
            ) {
              notificationService.cancelOperationFromNotification(operationId);
              notificationService.dismissNotification(objectWorkingId);
            }
          });
      }

      reduxStore.dispatch(setSidePanelBannerNotification({ type: SidePanelBannerStatus.NONE }));
    };

    const buttons = this.getSidePanelBannerButtons('', onClickHandler, i18n.t('Stop refresh'));

    const sidePanelBannerObj = {
      title: i18n.t('Refresh in progress...'),
      type: SidePanelBannerStatus.IN_PROGRESS,
      onDismissBanner: onDismissHandler,
      children: buttons,
    } as SidePanelBanner;

    // Dispatch the notification to the side panel to show the SidePanelNotification component.
    sidePanelBannerObj && reduxStore.dispatch(setSidePanelBannerNotification(sidePanelBannerObj));
  }

  /**
   * Handles the refresh object and refresh selected.
   * Creates refresh operation per each passed objectWorkingId
   *
   * @param objectWorkingIds Contains unique Id of the objects, allowing to reference source object.
   */
  @sidePanelOperationDecorator.operationWrapper
  refresh(...objectWorkingIds: number[]): void {
    objectWorkingIds.forEach(objectWorkingId => {
      const sourceObject =
        officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      reduxStore.dispatch(refreshRequested(objectWorkingId, sourceObject?.importType));
    });

    const { operations } = reduxStore.getState().operationReducer;
    this.showRefreshInProgressBanner(operations);
  }

  /**
   * Toggles flags for cleardata and refresh all existing objects.
   */
  @sidePanelOperationDecorator.operationWrapper
  async viewData(): Promise<void> {
    // @ts-expect-error
    reduxStore.dispatch(officeActions.toggleSecuredFlag(false));
    officeStoreHelper.setPropertyValue(OfficeSettingsEnum.isSecured, false);

    // @ts-expect-error
    reduxStore.dispatch(officeActions.toggleIsClearDataFailedFlag(false));
    officeStoreHelper.setPropertyValue(OfficeSettingsEnum.isClearDataFailed, false);

    this.refresh(
      ...officeReducerHelper
        .getObjectsListFromObjectReducer()
        .map(({ objectWorkingId }) => objectWorkingId)
    );
  }

  async secureData(objects: any[]): Promise<void> {
    try {
      const { dispatch } = reduxStore;
      officeActions.toggleIsConfirmFlag(false)(dispatch);

      setTimeout(async () => {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiWorksheetHelper.checkIfAnySheetProtected(excelContext, objects);

        for (const object of objects) {
          // Bypass the image object if it was deleted from worksheet manually to not block
          // the queue of clear data operation.
          let triggerClearData = true;
          if (object?.importType === ObjectImportType.IMAGE) {
            const shapeInWorksheet =
              object?.bindId && (await officeShapeApiHelper.getShape(excelContext, object.bindId));
            if (!shapeInWorksheet) {
              triggerClearData = false;
            }
          }
          triggerClearData &&
            reduxStore.dispatch(clearDataRequested(object.objectWorkingId, object.importType));
        }
      }, 0);
    } catch (error) {
      errorService.handleError(error);
    }
  }

  /**
   * Handles the duplcicate action being trigerred
   * Creates uplicate popup for object being duplicated
   *
   * @param objectWorkingIds Contains unique Id of the objects, allowing to reference source object.
   * @param duplicatePopupParams Contains parameters for duplicate popup
   */
  @sidePanelOperationDecorator.operationWrapper
  duplicate(objectWorkingId: number, duplicatePopupParams: any): void {
    sidePanelNotificationHelper.setDuplicatePopup({
      objectWorkingId,
      ...duplicatePopupParams,
    });
  }

  /**
   * Handles the remove object and remove selected.
   * Creates remove operation per each passed objectWorkingId
   *
   * @param objectWorkingIds Contains unique Id of the objects, allowing to reference source object.
   */
  @sidePanelOperationDecorator.operationWrapper
  remove(...objectWorkingIds: number[]): void {
    objectWorkingIds.forEach(objectWorkingId => {
      const sourceObject =
        officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      reduxStore.dispatch(removeRequested(objectWorkingId, sourceObject?.importType));
    });
  }

  /**
   * Handles the editing of object.
   * Gets object data from reducer and opens popup depending of the type of object.
   *
   * @param objectWorkingIds contains unique Id of the objects, allowing to reference source object.
   */
  @sidePanelOperationDecorator.operationWrapper
  async edit(...objectWorkingIds: number[]): Promise<void> {
    // Validate multiple selection; if only one item is selected then create 1-element array
    const workingIds = Array.isArray(objectWorkingIds) ? objectWorkingIds : [objectWorkingIds];
    for (const objectWorkingId of workingIds) {
      const objectData =
        officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      const { bindId, mstrObjectType } = objectData;

      const excelContext = await officeApiHelper.getExcelContext();
      await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        await popupHelper.callForEditDossier(objectData);
      } else {
        popupHelper.callForEdit(objectData);
      }
    }
  }

  /**
   * Handles the re-prompting of object(s).
   * Gets object data from reducer and opens popup depending of the type of object.
   *
   * @param objectWorkingIds contains list of unique Id of the objects, allowing to reference source objects.
   * @param isFromDataOverviewDialog Flag which shows whether the re-prompting is from overview dialog.
   */
  @sidePanelOperationDecorator.operationWrapper
  async reprompt(objectWorkingIds: number[], isFromDataOverviewDialog = false): Promise<void> {
    // Prepare dispatch actions
    const dispatchTasks: any[] = [];

    // Reprompt each object (only if prompted) in the order of selection
    objectWorkingIds.forEach(objectWorkingId => {
      const objectData =
        officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      const { bindId, mstrObjectType, isPrompted, pageByData } = objectData;

      // Add a task to the queue only if the object is prompted
      // For Page-by objects, don't push the task if the report with the same page-by link Id
      // is already added to the dispatchTasks
      if (
        isPrompted &&
        (!pageByData ||
          dispatchTasks.every((task: any) => {
            const object = officeReducerHelper.getObjectFromObjectReducerByBindId(task.bindId);
            return object.pageByData?.pageByLinkId !== pageByData?.pageByLinkId;
          }))
      ) {
        dispatchTasks.push(
          sidePanelHelper.createRepromptTask(bindId, mstrObjectType, isFromDataOverviewDialog)
        );
      }
    });

    // Initialize the re-prompting queue state
    sidePanelHelper.clearRepromptTask();

    // Dispatch all actions together to start re-prompting in sequence
    // regardless of how many objects are selected.
    dispatchTasks.forEach(task => reduxStore.dispatch(addRepromptTask(task)));

    // Dispatch executeRepromptTask() once after all actions are dispatched
    reduxStore.dispatch(executeNextRepromptTask());
  }

  /**
   * Handles the refreshing of all pages associated with a specific page by link ID.
   *
   * @param pageByLinkId The ID of the page by link to refresh all pages for
   * @param setSidePanelPopup A function to set the side panel popup
   * @param objects An array of ObjectData containing object information
   */
  @sidePanelOperationDecorator.operationWrapper
  async refreshAllPages(
    pageByLinkId: string,
    setSidePanelPopup: React.Dispatch<PopupProps>,
    objects: ObjectData[]
  ): Promise<void> {
    sidePanelNotificationHelper.setRefreshAllPagesPopup({
      setSidePanelPopup,
      objects,
      pageByLinkId,
    });
  }

  /**
   * Handles the deleting of all pages associated with a specific page by link ID.
   *
   * @param pageByLinkId The ID of the page by link to refresh all pages for
   * @param setSidePanelPopup A function to set the side panel popup
   * @param objects An array of ObjectData containing object information
   */
  @sidePanelOperationDecorator.operationWrapper
  async deleteAllPages(
    pageByLinkId: string,
    setSidePanelPopup: React.Dispatch<PopupProps>,
    objects: ObjectData[]
  ): Promise<void> {
    sidePanelNotificationHelper.setDeleteAllPagesPopup({
      setSidePanelPopup,
      objects,
      pageByLinkId,
    });
  }
}

export const sidePanelService = new SidePanelService();
