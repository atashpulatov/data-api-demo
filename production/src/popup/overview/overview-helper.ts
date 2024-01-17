import { reduxStore } from '../../store';
import { popupHelper } from '../popup-helper';

class OverviewHelper {
  reduxStore: typeof reduxStore;

  constructor() {
    this.reduxStore = reduxStore;
  }

  async sendRefreshRequest(
    objectWorkingIds: number[],
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: 'overviewRefresh',
      objectWorkingIds
    });
  }

  async sendDeleteRequest(
    objectWorkingIds: number[],
  ): Promise<void> {
    popupHelper.officeMessageParent({
      command: 'overviewDelete',
      objectWorkingIds
    });
  }
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
