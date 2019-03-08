import {sessionHelper} from '../storage/session-helper';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';
import {officeProperties} from '../office/office-properties';
import {reduxStore} from '../store';
import {authenticationHelper} from '../authentication/authentication-helper';

class FileHistoryHelper {
  refreshReport = async (onRefresh, bindingId) => {
    try {
      await authenticationHelper.validateAuthToken();
      reduxStore.dispatch({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: bindingId,
      });
      await onRefresh(bindingId);
      notificationService.displayMessage('info', 'Report refreshed');
    } catch (error) {
      errorService.handleError(error);
    } finally {
      reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
      });
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
