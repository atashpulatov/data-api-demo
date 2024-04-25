import { PopupProps } from '@mstr/connector-components';

import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { sidePanelHelper } from './side-panel-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';

import officeStoreObject from '../../office/store/office-store-object';
import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { popupController } from '../../popup/popup-controller';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { updateObject } from '../../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import {
  highlightRequested,
  refreshRequested,
  removeRequested,
} from '../../redux-reducer/operation-reducer/operation-actions';
import { popupActions } from '../../redux-reducer/popup-reducer/popup-actions';
import {
  addRepromptTask,
  executeNextRepromptTask,
} from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import sidePanelOperationDecorator from './side-panel-operation-decorator';

export class SidePanelService {
  /**
   * Opens popup with table of objects
   * Prevent navigation tree from going straight into importing previously selected item.
   */
  @sidePanelOperationDecorator.operationWrapper
  async addData(): Promise<void> {
    // @ts-expect-error
    reduxStore.dispatch(navigationTreeActions.cancelImportRequest());
    await popupController.runPopupNavigation();
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
  }

  /**
   * Toggles flags for cleardata and refresh all existing objects.
   */
  @sidePanelOperationDecorator.operationWrapper
  async viewData(): Promise<void> {
    // @ts-expect-error
    reduxStore.dispatch(officeActions.toggleSecuredFlag(false));
    // @ts-expect-error
    reduxStore.dispatch(officeActions.toggleIsClearDataFailedFlag(false));
    this.refresh(
      ...officeReducerHelper
        .getObjectsListFromObjectReducer()
        .map(({ objectWorkingId }) => objectWorkingId)
    );
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
        // @ts-expect-error
        reduxStore.dispatch(popupActions.callForEditDossier(objectData));
      } else {
        // @ts-expect-error
        reduxStore.dispatch(popupActions.callForEdit(objectData));
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
      const { bindId, mstrObjectType, isPrompted } = objectData;

      // Add a task to the queue only if the object is prompted
      if (isPrompted) {
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