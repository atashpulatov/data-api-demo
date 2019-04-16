import {sessionHelper} from '../storage/session-helper';
import {notificationService} from '../notification/notification-service';
import {errorService} from '../error/error-handler';
import {officeProperties} from '../office/office-properties';
import {reduxStore} from '../store';
import {authenticationHelper} from '../authentication/authentication-helper';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

class FileHistoryHelper {
  refreshReport = async (onRefresh, bindingId, objectType, refreshAll = false) => {
    try {
      await authenticationHelper.validateAuthToken();
      reduxStore.dispatch({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: bindingId,
      });
      const refreshed = await onRefresh(bindingId, objectType);
      return (refreshAll && refreshed) || notificationService.displayMessage('success', `${capitalize(objectType)} refreshed`);
    } catch (error) {
      return (refreshAll && error) || errorService.handleError(error);
    } finally {
      reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
      });
    }
  };

  deleteReport = async (onDelete, bindingId, objectType) => {
    sessionHelper.enableLoading();
    try {
      const removed = await onDelete(bindingId);
      removed && notificationService.displayMessage('success', `${capitalize(objectType)} removed`);
    } catch (error) {
      errorService.handleError(error);
    } finally {
      sessionHelper.disableLoading();
    }
  }
}

export const fileHistoryHelper = new FileHistoryHelper();
