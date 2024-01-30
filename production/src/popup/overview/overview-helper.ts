import { popupHelper } from '../popup-helper';

export enum OverviewActionCommands {
  REFRESH= 'overview-refresh',
  REMOVE= 'overview-remove',
  DUPLICATE= 'overview-duplicate',
  DISMISS_NOTIFICATION= 'overview-dismiss-notification',
}

class OverviewHelper {
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
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
