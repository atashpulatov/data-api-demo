import { popupHelper } from '../popup-helper';

export enum OverviewActionCommands {
  REFRESH= 'overview-refresh',
  REMOVE= 'overview-remove',
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
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
