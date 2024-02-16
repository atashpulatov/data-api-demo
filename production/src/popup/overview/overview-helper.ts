import { popupTypes } from '@mstr/connector-components';
import { popupHelper } from '../popup-helper';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-notification-helper';
import operationErrorHandler from '../../operation/operation-error-handler';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { DialogPopup } from './overview-types';

export enum OverviewActionCommands {
  IMPORT= 'overview-import',
  EDIT= 'overview-edit',
  REFRESH= 'overview-refresh',
  REMOVE= 'overview-remove',
  DUPLICATE= 'overview-duplicate',
  REPROMPT= 'overview-reprompt',
  RANGE_TAKEN_OK= 'overview-range-taken-ok',
  RANGE_TAKEN_CLOSE= 'overview-range-taken-close',
  RENAME= 'overview-rename',
  GO_TO_WORKSHEET= 'overview-go-to-worksheet',
  DISMISS_NOTIFICATION= 'overview-dismiss-notification',
}

class OverviewHelper {
  sidePanelService: any;

  notificationService: any;

  init = (sidePanelService: any, notificationService: any) => {
    this.sidePanelService = sidePanelService;
    this.notificationService = notificationService;
  };

  /**
   * Sends message with import command to the Side Panel
   *
   */
  async sendImportRequest(): Promise<void> {
    popupHelper.officeMessageParent({ command: OverviewActionCommands.IMPORT });
  }

  /**
   * Sends message with edit command to the Side Panel
   *
   * @param {Array} objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendEditRequest(objectWorkingId: number): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.EDIT,
      objectWorkingId
    });
  }

  /**
   * Sends message with reprompt command to the Side Panel
   *
   * @param {Array} objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendRepromptRequest(objectWorkingIds: number[]): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.REPROMPT,
      objectWorkingIds
    });
  }

  /**
   * Sends message with refresh command to the Side Panel
   *
   * @param {Array} objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendRefreshRequest(
    objectWorkingIds: number[],
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.REFRESH,
      objectWorkingIds
    });
  }

  /**
   * Sends message with delete command to the Side Panel
   *
   * @param {Array} objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendDeleteRequest(objectWorkingIds: number[]): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.REMOVE,
      objectWorkingIds
    });
  }

  /**
   * Sends message with dismiss notification command to the Side Panel
   *
   * @param {Array} objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendDismissNotificationRequest(objectWorkingIds: number[]): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds
    });
  }

  /**
   * Sends message with duplicate command to the Side Panel
   *
   * @param {Array} objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   * @param {Boolean} insertNewWorksheet Flag indicating whether new worksheet should be inserted
   * @param {Boolean} withEdit Flag indicating whether duplicate should be performed with edit
   */
  async sendDuplicateRequest(
    objectWorkingIds: number[],
    insertNewWorksheet: boolean,
    withEdit: boolean
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds,
      insertNewWorksheet,
      withEdit
    });
  }

  /**
   * Sends message with rangeTakenOk command to the Side Panel
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handleRangeTakenOk = (objectWorkingId: number): void => {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.RANGE_TAKEN_OK,
      objectWorkingId
    });
  };

  /**
   * Sends message with rangeTakenClose command to the Side Panel
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handleRangeTakenClose = (objectWorkingId: number): void => {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingId
    });
  };

  /**
   * Sends message with rename command to the Side Panel
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} newName Updated name of the renamed object
   */
  async sendRenameRequest(
    objectWorkingId: number,
    newName: string
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.RENAME,
      objectWorkingId,
      newName
    });
  }

  /**
   * Sends message with goToWorksheet command to the Side Panel
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   */
  async sendGoToWorksheetRequest(
    objectWorkingId: number
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.GO_TO_WORKSHEET,
      objectWorkingId
    });
  }

  /**
   * Handles dismissing object notifications for given objectWorkingIds
   *
   * @param {Array} objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  handleDismissNotifications = (objectWorkingIds: number[]): void => {
    objectWorkingIds?.forEach(objectWorkingId => {
      this.notificationService.removeExistingNotification(objectWorkingId);
    });
  };

  /**
   * Handles proper Overview dialog action command based on the response
   *
   * @param {Object} response Response from the Overview dialog
   */
  async handleOverviewActionCommand(
    response: {
      command: OverviewActionCommands,
      objectWorkingId?: number,
      objectWorkingIds?: number[],
      insertNewWorksheet?: boolean,
      withEdit?: boolean,
      newName?: string
    }
  ): Promise<void> {
    this.handleDismissNotifications(response.objectWorkingIds);

    switch (response.command) {
      case OverviewActionCommands.IMPORT:
        await this.sidePanelService.addData();
        break;
      case OverviewActionCommands.EDIT:
        await this.sidePanelService.edit(response.objectWorkingId);
        break;
      case OverviewActionCommands.REPROMPT:
        await this.sidePanelService.reprompt(response.objectWorkingIds);
        break;
      case OverviewActionCommands.REFRESH:
        await this.sidePanelService.refresh(response.objectWorkingIds);
        break;
      case OverviewActionCommands.REMOVE:
        await this.sidePanelService.remove(response.objectWorkingIds);
        break;
      case OverviewActionCommands.DUPLICATE:
        response.objectWorkingIds.forEach(objectWorkingId => {
          this.sidePanelService.duplicate(objectWorkingId, response.insertNewWorksheet, response.withEdit);
        });
        break;
      case OverviewActionCommands.RANGE_TAKEN_OK:
        sidePanelNotificationHelper.importInNewRange(response.objectWorkingId, null, true);
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.RANGE_TAKEN_CLOSE:
        operationErrorHandler.clearFailedObjectFromRedux(response.objectWorkingId);
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.RENAME:
        this.sidePanelService.rename(response.objectWorkingId, response.newName);
        break;
      case OverviewActionCommands.GO_TO_WORKSHEET:
        this.sidePanelService.highlightObject(response.objectWorkingId);
        break;
      case OverviewActionCommands.DISMISS_NOTIFICATION:
        this.handleDismissNotifications(response.objectWorkingIds);
        break;
      default:
        console.log('Unhandled dialog command: ', response.command);
        break;
    }
  }

  /**
   * Transforms Excel objects and notifications into a format that can be displayed in the Overview dialog grid
   *
   * @param {Array} objects Imported objects data
   * @param {Array} notifications Objects notifications
   *
   * @returns {Array} Transformed objects
   */
  // TODO add types once redux state is typed
  transformExcelObjects(objects: any[], notifications: any[]): any[] {
    return objects.map((object) => {
      const {
        objectWorkingId, mstrObjectType, name, refreshDate, details, importType, startCell, worksheet
      } = object;

      const objectNotification = notifications.find(notification => notification.objectWorkingId === objectWorkingId);

      return {
        objectWorkingId,
        mstrObjectType,
        name,
        // Uncomment during F38416 Page-by feature development
        // pageLayout: object.pageBy,
        worksheet: worksheet?.name,
        cell: startCell,
        rows: details?.excelTableSize?.rows,
        columns: details?.excelTableSize?.columns,
        objectType: importType,
        lastUpdated: refreshDate,
        status: {
          type: objectNotification?.type,
          title: objectNotification?.title,
          details: objectNotification?.details,
        },
        project: details?.ancestors[0].name,
        owner: details?.owner.name,
        importedBy: details?.importedBy,
      };
    });
  }

  /**
   * Sets Duplicate popup for Overview dialog
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {String} activeCellAddress Address of the active cell in Excel
   * @param {Function} onDuplicate Function used for triggering duplicate operation
   * @param {Function} setDialogPopup Function used as a callback for seting Overview dialog popup
   */
  setDuplicatePopup({
    objectWorkingId, activeCellAddress, onDuplicate, setDialogPopup
  }: DialogPopup): void {
    setDialogPopup({
      type: popupTypes.DUPLICATE,
      activeCell: officeApiHelper.getCellAddressWithDollars(activeCellAddress),
      onImport: (isActiveCellOptionSelected) => {
        onDuplicate(objectWorkingId, !isActiveCellOptionSelected, false);
        setDialogPopup(null);
      },
      onEdit: (isActiveCellOptionSelected) => {
        onDuplicate(objectWorkingId, !isActiveCellOptionSelected, true);
        setDialogPopup(null);
      },
      onClose: () => setDialogPopup(null)
    });
  }

  /**
   * Sets Range Taken popup for Overview dialog
   *
   * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Function} setDialogPopup Function used as a callback for seting Overview dialog popup
   */
  setRangeTakenPopup({ objectWorkingId, setDialogPopup }: DialogPopup): void {
    setDialogPopup({
      type: popupTypes.RANGE_TAKEN_OVERVIEW,
      onOk: () => {
        this.handleRangeTakenOk(objectWorkingId);
        officeReducerHelper.clearPopupData();
      },
      onClose: () => {
        this.handleRangeTakenClose(objectWorkingId);
        officeReducerHelper.clearPopupData();
      },
    });
  }
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
