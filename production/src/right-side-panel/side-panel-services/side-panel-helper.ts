import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import officeStoreHelper from '../../office/store/office-store-helper';
import { popupHelper } from '../../redux-reducer/popup-reducer/popup-helper';

import { reduxStore } from '../../store';

import { MstrObjectTypes } from '../../mstr-object/mstr-object-types';
import { DialogType } from '../../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { ObjectData } from '../../types/object-types';

import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { duplicateRequested } from '../../redux-reducer/operation-reducer/operation-actions';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { clearRepromptTask } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import initializationErrorDecorator from '../settings-side-panel/initialization-error-decorator';
import { OfficeSettingsEnum } from '../../constants/office-constants';
import { ObjectImportType } from '../../mstr-object/constants';

class SidePanelHelper {
  /**
   * Clears the reprompt task queue and resets the index.
   */
  clearRepromptTask(): void {
    reduxStore.dispatch(clearRepromptTask());
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
          // @ts-expect-error
          reduxStore.dispatch(popupStateActions.setPopupType(popupType));
        }

        if (isDossier) {
          await popupHelper.callForRepromptDossier(objectData);
        } else {
          popupHelper.callForReprompt(objectData);
        }
      },
    };
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
  async duplicateObject(
    objectWorkingId: number,
    insertNewWorksheet: boolean,
    withEdit: boolean
  ): Promise<void> {
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
      await popupHelper.callForDuplicate(object);
    } else {
      reduxStore.dispatch(duplicateRequested(object));
    }
  }

  @initializationErrorDecorator.initializationWrapper
  initializeClearDataFlags(): void {
    if (officeStoreHelper.getPropertyValue(OfficeSettingsEnum.isSecured)) {
      // @ts-expect-error
      reduxStore.dispatch(officeActions.toggleSecuredFlag(true));
      officeStoreHelper.setPropertyValue(OfficeSettingsEnum.isSecured, true);
    }

    if (officeStoreHelper.getPropertyValue(OfficeSettingsEnum.isClearDataFailed)) {
      // @ts-expect-error
      reduxStore.dispatch(officeActions.toggleIsClearDataFailedFlag(true));
      officeStoreHelper.setPropertyValue(OfficeSettingsEnum.isClearDataFailed, true);
    }
  }
}

export const sidePanelHelper = new SidePanelHelper();
