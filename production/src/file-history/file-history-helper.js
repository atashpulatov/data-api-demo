import { sessionHelper } from "../storage/session-helper";
import { notificationService } from "../notification/notification-service";
import { errorService } from "../error/error-handler";

class FileHistoryHelper {
    refreshReport = async (onRefresh, bindingId) => {
        sessionHelper.enableLoading();
        try {
            await onRefresh(bindingId);
            notificationService.displayMessage('info', 'Report refreshed');
        } catch (error) {
            errorService.handleError(error);
        } finally {
            sessionHelper.disableLoading();
        }
    }

    deleteReport = async (onDelete, bindingId) => {
        sessionHelper.enableLoading();
        try {
            await onDelete(bindingId);
            notificationService.displayMessage('info', 'Report removed');
        } catch (error) {
            errorService.handleError(error);
        } finally {
            sessionHelper.disableLoading();
        }
    }
}

export const fileHistoryHelper = new FileHistoryHelper();
