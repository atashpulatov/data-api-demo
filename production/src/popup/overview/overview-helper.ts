import { popupTypes } from '@mstr/connector-components';
import { popupHelper } from '../popup-helper';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-notification-helper';
import operationErrorHandler from '../../operation/operation-error-handler';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';

export enum OverviewActionCommands {
  REFRESH= 'overview-refresh',
  REMOVE= 'overview-remove',
  DUPLICATE= 'overview-duplicate',
  RANGE_TAKEN_OK= 'overview-range-taken-ok',
  RANGE_TAKEN_CLOSE= 'overview-range-taken-close',
  DISMISS_NOTIFICATION= 'overview-dismiss-notification',
}

class OverviewHelper {
  sidePanelService: any;

  notificationService: any;

  init = (sidePanelService: any, notificationService: any) => {
    this.sidePanelService = sidePanelService;
    this.notificationService = notificationService;
  };

  async sendRefreshRequest(
    objectWorkingIds: number[],
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.REFRESH,
      objectWorkingIds
    });
  }

  async sendDeleteRequest(
    objectWorkingIds: number[],
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.REMOVE,
      objectWorkingIds
    });
  }

  async sendDismissNotificationRequest(objectWorkingIds: number[]): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds
    });
  }

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

  handleRangeTakenOk = (objectWorkingIds: number[]): void => {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.RANGE_TAKEN_OK,
      objectWorkingIds
    });
  };

  handleRangeTakenClose = (objectWorkingIds: number[]): void => {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingIds
    });
  };

  handleDismissNotifications = (objectWorkingIds: number[]): void => {
    objectWorkingIds?.forEach(objectWorkingId => {
      this.notificationService.removeExistingNotification(objectWorkingId);
    });
  };

  async handleOverviewActionCommand(
    response: {
      command: OverviewActionCommands,
      objectWorkingIds: number[],
      insertNewWorksheet?: boolean,
      withEdit?: boolean
    }
  ): Promise<void> {
    this.handleDismissNotifications(response.objectWorkingIds);

    switch (response.command) {
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
        sidePanelNotificationHelper.importInNewRange(response.objectWorkingIds[0], null, true);
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.RANGE_TAKEN_CLOSE:
        operationErrorHandler.clearFailedObjectFromRedux(response.objectWorkingIds[0]);
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.DISMISS_NOTIFICATION:
        this.handleDismissNotifications(response.objectWorkingIds);
        break;
      default:
        console.log('Unhandled dialog command: ', response.command);
        break;
    }
  }

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
        status: objectNotification?.title,
        project: details?.ancestors[0].name,
        owner: details?.owner.name,
        importedBy: details?.importedBy,
      };
    });
  }

  setDuplicatePopup({
    objectWorkingId, activeCellAddress, onDuplicate, setDialogPopup
  }: any) {
    setDialogPopup({
      type: popupTypes.DUPLICATE,
      activeCell: officeApiHelper.getCellAddressWithDollars(activeCellAddress),
      onImport: (isActiveCellOptionSelected: boolean) => {
        onDuplicate(objectWorkingId, !isActiveCellOptionSelected, false);
        setDialogPopup(null);
      },
      onEdit: () => {
        // TODO: Finish when Edit workflow is implemented
        setDialogPopup(null);
      },
      onClose: () => setDialogPopup(null)
    });
  }

  setRangeTakenPopup({ objectWorkingId, setDialogPopup }: any) {
    setDialogPopup({
      type: popupTypes.RANGE_TAKEN_OVERVIEW,
      onOk: () => {
        this.handleRangeTakenOk([objectWorkingId]);
        officeReducerHelper.clearPopupData();
      },
      onClose: () => {
        this.handleRangeTakenClose([objectWorkingId]);
        officeReducerHelper.clearPopupData();
      },
    });
  }
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
