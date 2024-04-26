import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { officeShapeApiHelper } from '../../office/shapes/office-shape-api-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import officeStoreHelper from '../../office/store/office-store-helper';
import { pageByHelper } from '../../page-by/page-by-helper';

import { MstrObjectTypes } from '../../mstr-object/mstr-object-types';
import { DialogType } from '../../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { ObjectData } from '../../types/object-types';

import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { duplicateRequested } from '../../redux-reducer/operation-reducer/operation-actions';
import { popupActions } from '../../redux-reducer/popup-reducer/popup-actions';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { clearRepromptTask } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import { ObjectImportType } from '../../mstr-object/constants';

class SidePanelHelper {
  reduxStore: any;

  init = (reduxStore: any): void => {
    this.reduxStore = reduxStore;

    this.clearRepromptTask = this.clearRepromptTask.bind(this);
    this.createRepromptTask = this.createRepromptTask.bind(this);
    this.highlightImageObject = this.highlightImageObject.bind(this);
  };

  /**
   * Clears the reprompt task queue and resets the index.
   */
  clearRepromptTask(): void {
    this.reduxStore.dispatch(clearRepromptTask());
  }

  /**
   * Handles the refresh of multiple pages for page-by object.
   *
   * @param objectWorkingId Contains unique Id of the object, allowing to reference source object.
   */
  refreshMultiplePagesForPageBy(objectWorkingId: number): void {
    pageByHelper.handleRefreshingMultiplePages(objectWorkingId);
  }

  /**
   * Handles the remove of multiple pages for page-by object.
   *
   * @param objectWorkingId Contains unique Id of the object, allowing to reference source object.
   */
  removeMultiplePagesForPageBy(objectWorkingId: number): void {
    pageByHelper.handleRemovingMultiplePages(objectWorkingId);
  }

  removeMultipleObjectsPagesForPageBy(objectWorkingId: number): void {
    pageByHelper.handleRemovingMultipleObjectPages(objectWorkingId);
  }

  /**
   * Creates a prompted task for the reprompt queue. Includes the callback to be executed.
   * @param bindId Unique Id of the object, allowing to reference source object.
   * @param mstrObjectType Contains information about the type of object.
   * @param isFromDataOverviewDialog Flag which shows whether the re-prompting is from overview dialog.
   * @returns JSON action object
   */
  createRepromptTask(
    bindId: string,
    mstrObjectType: MstrObjectTypes,
    isFromDataOverviewDialog: boolean
  ): any {
    return {
      bindId,
      isPrompted: true,
      callback: async () => {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

        const objectData = officeReducerHelper.getObjectFromObjectReducerByBindId(bindId);
        const isDossier = mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;

        if (isFromDataOverviewDialog) {
          const popupType = isDossier
            ? DialogType.repromptDossierDataOverview
            : DialogType.repromptReportDataOverview;
          this.reduxStore.dispatch(popupStateActions.setPopupType(popupType));
        }

        // Based on the type of object, call the appropriate popup
        const popupAction = isDossier
          ? popupActions.callForRepromptDossier(objectData)
          : popupActions.callForReprompt(objectData);

        this.reduxStore.dispatch(popupAction);
      },
    };
  }

  /**
   * Handles the editing of object.
   * Gets object data from reducer and opens popup depending of the type of object.
   *
   * @param objectData Conatins information about the object.
   */
  async highlightImageObject(objectData: ObjectData): Promise<void> {
    const excelContext = await officeApiHelper.getExcelContext();

    const { bindId } = objectData;
    const shapeInWorksheet: any =
      bindId && (await officeShapeApiHelper.getShape(excelContext, bindId));

    // Omit the highlight operation, if shape(visualization image) was removed manually from the worksheet.
    if (!shapeInWorksheet) {
      return;
    }

    const worksheet = excelContext.workbook.worksheets.getItem(shapeInWorksheet?.worksheetId);

    worksheet.activate();
    await excelContext.sync();
  }

  /**
   * Handle the user interaction with duplicate popup UI.
   * Open edit popup for duplicate with edit.
   * Dispatch duplicate operation for duplicate with import.
   *
   * Copy data of source object to new object.
   * Delete references to old object in new object.
   *
   * @param objectWorkingId Unique Id of the object, allowing to reference source object for duplication.
   * @param insertNewWorksheet  Flag which shows whether the duplication should happen to new excel worksheet.
   * @param withEdit Flag which shows whether the duplication should happen with additional edit popup.
   */
  duplicateObject(objectWorkingId: number, insertNewWorksheet: boolean, withEdit: boolean): void {
    const sourceObject =
      officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    const object: ObjectData = JSON.parse(JSON.stringify(sourceObject));
    object.insertNewWorksheet = insertNewWorksheet;
    object.objectWorkingId = Date.now();

    if (object.importType === ObjectImportType.IMAGE) {
      object.bindIdToBeDuplicated = object.bindId;
    }

    delete object.bindId;
    delete object.tableName;
    delete object.refreshDate;
    delete object.preparedInstanceId;
    delete object.previousTableDimensions;
    if (object.subtotalsInfo) {
      delete object.subtotalsInfo.subtotalsAddresses;
    }

    if (withEdit) {
      this.reduxStore.dispatch(popupActions.callForDuplicate(object));
    } else {
      this.reduxStore.dispatch(duplicateRequested(object));
    }
  }

  initializeClearDataFlags(): void {
    officeStoreHelper.isFileSecured() &&
      this.reduxStore.dispatch(officeActions.toggleSecuredFlag(true));
    officeStoreHelper.isClearDataFailed() &&
      this.reduxStore.dispatch(officeActions.toggleIsClearDataFailedFlag(true));
  }
}

export const sidePanelHelper = new SidePanelHelper();
