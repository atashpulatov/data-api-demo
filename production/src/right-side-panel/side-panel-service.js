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
import {
  addRepromptTask,
  executeNextRepromptTask,
  clearRepromptTask,
} from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import { officeShapeApiHelper } from '../office/shapes/office-shape-api-helper';
import { objectImportType } from '../mstr-object/constants';

const EXCEL_REUSE_PROMPT_ANSWERS = 'excelReusePromptAnswers';
class SidePanelService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Clears the reprompt task queue and resets the index.
   */
  clearRepromptTask = async () => {
    this.reduxStore.dispatch(clearRepromptTask());
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
    const sourceObject = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    // This operation is not supported for images as Excel API does not support shape selection as of now
    if (sourceObject?.importType === objectImportType.IMAGE) {
      const excelContext = await officeApiHelper.getExcelContext();

      // retrieve the shape in the worksheet
      const objectData = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      const { bindId } = objectData;

      const shapeInWorksheet = bindId && await officeShapeApiHelper.getShape(excelContext, bindId);
      const worksheet = excelContext.workbook.worksheets.getItem(shapeInWorksheet?.worksheetId);

      worksheet.activate();
      await excelContext.sync();
      
      return;
    }
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
      const sourceObject = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      this.reduxStore.dispatch(refreshRequested(objectWorkingId, sourceObject?.importType));
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
      const sourceObject = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      this.reduxStore.dispatch(removeRequested(objectWorkingId, sourceObject?.importType));
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

    if (object.importType === objectImportType.IMAGE) {
      object.bindIdToBeDuplicated = object.bindId;
    }

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
   * @param {Array} objectWorkingIds contains unique Id of the objects, allowing to reference source object.
   */
  edit = async (objectWorkingIds) => {
    // Validate multiple selection; if only one item is selected then create 1-element array
    const aWorkingIds = Array.isArray(objectWorkingIds)
      ? objectWorkingIds
      : [objectWorkingIds];
    for (const objectWorkingId of aWorkingIds) {
      const objectData = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      const { bindId, mstrObjectType } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();
      await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        this.reduxStore.dispatch(popupActions.callForEditDossier({ bindId, mstrObjectType }));
      } else {
        this.reduxStore.dispatch(popupActions.callForEdit({ bindId, mstrObjectType }));
      }
    }
  };

  /**
   * Creates a prompted task for the reprompt queue. Includes the callback to be executed.
   * @param {*} objectWorkingId
   * @param {*} bindId
   * @param {*} mstrObjectType
   * @returns JSON action object
   */
  createRepromptTask = (bindId, mstrObjectType) => ({
    bindId,
    isPrompted: true,
    callback: async () => {
      const excelContext = await officeApiHelper.getExcelContext();
      await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

      // Based on the type of object, call the appropriate popup
      const popupAction = mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name
        ? popupActions.callForRepromptDossier({ bindId, mstrObjectType })
        : popupActions.callForReprompt({ bindId, mstrObjectType });

      this.reduxStore.dispatch(popupAction);
    },
  });

  /**
   * Handles the re-prompting of object(s).
   * Gets object data from reducer and opens popup depending of the type of object.
   *
   * @param {Array} objectWorkingIds contains list of unique Id of the objects, allowing to reference source objects.
   */
  reprompt = async (objectWorkingIds) => {
    // Prepare dispatch actions
    const dispatchTasks = [];

    // Reprompt each object (only if prompted) in the order of selection
    objectWorkingIds.forEach(objectWorkingId => {
      const objectData = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
      const { bindId, mstrObjectType, isPrompted } = objectData;

      // Add a task to the queue only if the object is prompted
      if (isPrompted) {
        dispatchTasks.push(this.createRepromptTask(bindId, mstrObjectType));
      }
    });

    // Initialize the re-prompting queue state
    this.clearRepromptTask();

    // Dispatch all actions together to start re-prompting in sequence
    // regardless of how many objects are selected.
    dispatchTasks.forEach(task => this.reduxStore.dispatch(addRepromptTask(task)));

    // Dispatch executeRepromptTask() once after all actions are dispatched
    this.reduxStore.dispatch(executeNextRepromptTask());
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
