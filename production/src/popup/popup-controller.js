import {selectorProperties} from '../attribute-selector/selector-properties';
import {officeDisplayService} from '../office/office-display-service';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {sessionHelper} from '../storage/session-helper';
import {objectTypes} from 'mstr-react-library';
import {notificationService} from '../notification/notification-service';
import {reduxStore} from '../store';
import {CLEAR_WINDOW} from './popup-actions';
import {errorService} from '../error/error-handler';
import {authenticationHelper} from '../authentication/authentication-helper';
import {officeProperties} from '../office/office-properties';
const URL = `${window.location.href}`;
const IS_LOCALHOST = URL.includes('localhost');

class PopupController {
  runPopupNavigation = async () => {
    await this.runPopup(PopupTypeEnum.navigationTree, 80, 80);
  };

  runPopup = async (popupType, height, width) => {
    const session = sessionHelper.getSession();
    try {
      await authenticationHelper.validateAuthToken();
    } catch (error) {
      errorService.handleError(error);
      return;
    }
    let url = URL;
    if (IS_LOCALHOST) {
      url = `${window.location.origin}/popup.html`;
    } else {
      url = url.replace('index.html', 'popup.html');
    }
    const splittedUrl = url.split('?'); // we need to get rid of any query params
    try {
      Office.context.ui.displayDialogAsync(
          splittedUrl[0]
        + '?popupType=' + popupType
        + '&envUrl=' + session.url
        + '&token=' + session.authToken,
          {height, width, displayInIframe: true},
          (asyncResult) => {
            const dialog = asyncResult.value;
            sessionHelper.setDialog(dialog);
            dialog.addEventHandler(
                Office.EventType.DialogMessageReceived,
                this.onMessageFromPopup.bind(null, dialog));
            reduxStore.dispatch({type: CLEAR_WINDOW});
            dialog.addEventHandler(
            // Event received on dialog close
                Office.EventType.DialogEventReceived, (event) => {
                  reduxStore.dispatch({type: officeProperties.actions.popupHidden});
                  console.log(event);
                });

            reduxStore.dispatch({type: officeProperties.actions.popupShown});
          });
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  };

  onMessageFromPopup = async (dialog, arg) => {
    const message = arg.message;
    const response = JSON.parse(message);
    try {
      await this.closeDialog(dialog);
      switch (response.command) {
        case selectorProperties.commandOk:

          await this.handleOkCommand(response, dialog);
          break;
        case selectorProperties.commandOnUpdate:
          await this.handleUpdateCommand(response, dialog);
          break;
        case selectorProperties.commandCancel:
          break;
        case selectorProperties.commandError:
          const error = errorService.errorRestFactory(response.error);
          errorService.handleError(error, false);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error.message);
      errorService.handleOfficeError(error);
    } finally {
      reduxStore.dispatch({type: officeProperties.actions.popupHidden});
    }
  }

  handleUpdateCommand = async (response) => {
    if (response.reportId
      && response.projectId
      && response.reportSubtype
      && response.body) {
      const result = await officeDisplayService.printObject(response.reportId, response.projectId, response.reportSubtype === objectTypes.getTypeValues('Report').subtype, null, null, null, response.body);
      if (result) {
        notificationService.displayMessage(result.type, result.message);
      }
    }
  }

  handleOkCommand = async (response) => {
    if (response.chosenObject) {
      reduxStore.dispatch({type: officeProperties.actions.startLoading});
      const result = await officeDisplayService.printObject(response.chosenObject, response.chosenProject, response.chosenSubtype === objectTypes.getTypeValues('Report').subtype);
      if (result) {
        notificationService.displayMessage(result.type, result.message);
      }
    }
  }

  loadPending = (wrapped) => {
    return async (...args) => {
      this.runPopup(PopupTypeEnum.loadingPage, 30, 40);
      return await wrapped(...args);
    };
  }

  closeDialog = (dialog) => {
    try {
      return dialog.close();
    } catch (e) {
      console.log('Attempted to close an already closed dialog');
    }
  }
}

export const popupController = new PopupController();
export const loadPending = popupController.loadPending;
