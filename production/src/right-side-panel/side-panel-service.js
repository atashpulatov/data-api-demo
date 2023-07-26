import officeStoreObject from '../office/store/office-store-object';
import officeReducerHelper from '../office/store/office-reducer-helper';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { popupController } from '../popup/popup-controller';
import { updateObject } from '../redux-reducer/object-reducer/object-actions';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import {
  refreshRequested, removeRequested, duplicateRequested, highlightRequested,
} from '../redux-reducer/operation-reducer/operation-actions';
import { userRestService } from '../home/user-rest-service';

const EXCEL_REUSE_PROMPT_ANSWERS = 'excelReusePromptAnswers';

class SidePanelService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Opens popup with table of objects
   * Prevent navigation tree from going straight into importing previously selected item.
   */
  addData = async () => {
    this.reduxStore.dispatch(navigationTreeActions.cancelImportRequest());
    await popupController.runPopupNavigation();
  };

  /**
   * Handles the highlighting of object.
   * Creates highlight operation for specific objectWorkingId.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  highlightObject = async (objectWorkingId) => {
    this.reduxStore.dispatch(highlightRequested(objectWorkingId));
  };

  /**
   * Handles the renaming of object.
   * Calls officeStoreObject.saveObjectsInExcelStore to modify name field in Object Data
   * for object corresponding to passed objectWorkingID
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   * @param {String} newName New name for object
   */
  rename = async (objectWorkingId, newName) => {
    const renamedObject = { objectWorkingId, name: newName };
    this.reduxStore.dispatch(updateObject(renamedObject));
    await officeStoreObject.saveObjectsInExcelStore();
  };

  /**
   * Handles the refresh object and refresh selected.
   * Creates refresh operation per each passed objectWorkingId
   *
   * @param {Array} objectWorkingIds Contains unique Id of the objects, allowing to reference source object.
   */
  refresh = (objectWorkingIds) => {
    objectWorkingIds.forEach(objectWorkingId => {
      this.reduxStore.dispatch(refreshRequested(objectWorkingId));
    });
  };

  /**
   * Handles the remove object and remove selected.
   * Creates remove operation per each passed objectWorkingId
   *
   * @param {Array} objectWorkingIds Contains unique Id of the objects, allowing to reference source object.
   */
  remove = async (objectWorkingIds) => {
    objectWorkingIds.forEach(objectWorkingId => {
      this.reduxStore.dispatch(removeRequested(objectWorkingId));
    });
  };

  /**
   * Handle the user interaction with duplicate popup UI.
   * Open edit popup for duplicate with edit.
   * Dispatch duplicate operation for duplicate with import.
   *
   * Copy data of source object to new object.
   * Delete references to old object in new object.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object for duplication.
   * @param {Boolean} insertNewWorksheet  Flag which shows whether the duplication should happen to new excel worksheet.
   * @param {Boolean} withEdit Flag which shows whether the duplication should happen with additional edit popup.
   */
  duplicate = async (objectWorkingId, insertNewWorksheet, withEdit) => {
    const sourceObject = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    const object = JSON.parse(JSON.stringify(sourceObject));
    object.insertNewWorksheet = insertNewWorksheet;
    object.objectWorkingId = Date.now();

    delete object.bindId;
    delete object.tableName;
    delete object.refreshDate;
    delete object.preparedInstanceId;
    delete object.previousTableDimensions;
    if (object.subtotalsInfo) { delete object.subtotalsInfo.subtotalsAddresses; }

    if (withEdit) {
      this.reduxStore.dispatch(popupActions.callForDuplicate(object));
    } else {
      this.reduxStore.dispatch(duplicateRequested(object));
    }
  };

  /**
   * Handles the editing of object.
   * GEts object data from reducer and opens popup depending of the type of object.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  edit = async (objectWorkingId) => {
    const objectData = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    const { bindId, mstrObjectType } = objectData;
    const excelContext = await officeApiHelper.getExcelContext();
    await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

    if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
      this.reduxStore.dispatch(popupActions.callForEditDossier({ bindId, mstrObjectType }));
    } else {
      this.reduxStore.dispatch(popupActions.callForEdit({ bindId, mstrObjectType }));
    }
  };

  /**
   * Handles the editing of object.
   * GEts object data from reducer and opens popup depending of the type of object.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  initReusePromptAnswers = async () => {
    const { value } = await userRestService.getUserPreference(EXCEL_REUSE_PROMPT_ANSWERS);
    const reusePromptAnswersFlag = !Number.isNaN(+value) ? !!parseInt(value, 10) : JSON.parse(value);

    this.reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswersFlag));
  };

  /**
   * Handles the editing of object.
   * GEts object data from reducer and opens popup depending of the type of object.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  toggleReusePromptAnswers = async (reusePromptAnswers) => {
    const { value } = await userRestService.setUserPreference(EXCEL_REUSE_PROMPT_ANSWERS, !reusePromptAnswers);
    const reusePromptAnswersFlag = !Number.isNaN(+value) ? !!parseInt(value, 10) : JSON.parse(value);

    this.reduxStore.dispatch(officeActions.toggleReusePromptAnswersFlag(reusePromptAnswersFlag));
  };

  /**
   * Handles the editing of object.
   * GEts object data from reducer and opens popup depending of the type of object.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  toggleSettingsPanel = (settingsPanelLoded) => {
    this.reduxStore.dispatch(officeActions.toggleSettingsPanelLoadedFlag(settingsPanelLoded));
  };
}

export const sidePanelService = new SidePanelService();
