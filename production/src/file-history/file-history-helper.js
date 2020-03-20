import { sessionHelper } from '../storage/session-helper';
import { notificationService } from '../notification/notification-service';
import { errorService } from '../error/error-handler';


class FileHistoryHelper {
  deleteObject = async (
    onDelete,
    bindId,
    isCrosstab = false,
    crosstabHeaderDimensions = {},
    objectWorkingId,
    message
  ) => {
    sessionHelper.enableLoading();
    try {
      const removed = await onDelete(bindId, isCrosstab, crosstabHeaderDimensions, objectWorkingId);
      removed && notificationService.displayTranslatedNotification({ type: 'success', content: message });
    } catch (error) {
      errorService.handleError(error);
    } finally {
      sessionHelper.disableLoading();
    }
  }
}

export const fileHistoryHelper = new FileHistoryHelper();
