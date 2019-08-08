import {sessionHelper} from '../storage/session-helper';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

class FileHistoryHelper {
  deleteReport = async (onDelete, bindingId, isCrosstab = false, crosstabHeaderDimensions = {}, message) => {
    sessionHelper.enableLoading();
    try {
      const removed = await onDelete(bindingId, isCrosstab, crosstabHeaderDimensions);
      removed && notificationService.displayTranslatedNotification('success', message);
    } catch (error) {
      errorService.handleError(error);
    } finally {
      sessionHelper.disableLoading();
    }
  }
}

export const fileHistoryHelper = new FileHistoryHelper();
