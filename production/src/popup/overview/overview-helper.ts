import { reduxStore } from '../../store';
import { popupHelper } from '../popup-helper';

export enum OverviewActionCommands {
  refresh= 'overview-refresh',
  remove= 'overview-remove',
}

class OverviewHelper {
  reduxStore: typeof reduxStore;

  constructor() {
    this.reduxStore = reduxStore;
  }

  async sendRefreshRequest(
    objectWorkingIds: number[],
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.refresh,
      objectWorkingIds
    });
  }

  async sendDeleteRequest(
    objectWorkingIds: number[],
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.remove,
      objectWorkingIds
    });
  }
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
