import { popupHelper } from '../popup-helper';

export enum OverviewActionCommands {
  IMPORT= 'overview-import',
  REFRESH= 'overview-refresh',
  REMOVE= 'overview-remove',
  DUPLICATE= 'overview-duplicate',
  DISMISS_NOTIFICATION= 'overview-dismiss-notification',
}

class OverviewHelper {
  sidePanelService: any;

  notificationService: any;

  init = (sidePanelService: any, notificationService: any) => {
    this.sidePanelService = sidePanelService;
    this.notificationService = notificationService;
  };

  async sendImportRequest(): Promise<void> {
    popupHelper.officeMessageParent({ command: OverviewActionCommands.IMPORT });
  }

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

  async sendDuplicateRequest(objectWorkingIds: number[]): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds
    });
  }

  handleDismissNotifications = (objectWorkingIds: number[]): void => {
    objectWorkingIds?.forEach(objectWorkingId => {
      this.notificationService.removeExistingNotification(objectWorkingId);
    });
  };

  async handleOverviewActionCommand(
    response: {command: OverviewActionCommands, objectWorkingIds: number[]}
  ): Promise<void> {
    this.handleDismissNotifications(response.objectWorkingIds);
    switch (response.command) {
      case OverviewActionCommands.IMPORT:
        await this.sidePanelService.addData({ initializeOverview: true });
        break;
      case OverviewActionCommands.REFRESH:
        await this.sidePanelService.refresh(response.objectWorkingIds);
        break;
      case OverviewActionCommands.REMOVE:
        await this.sidePanelService.remove(response.objectWorkingIds);
        break;
      case OverviewActionCommands.DUPLICATE:
        // TODO this is done for purpose of testing, should be finalized during action implementation
        response.objectWorkingIds.forEach(objectWorkingId => {
          this.sidePanelService.duplicate(objectWorkingId, true, false);
        });
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
        // Uncomment and add values during F38416 Page-by feature development
        // pageLayout: object.pageBy,
        worksheet: '',
        cell: '',
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
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
