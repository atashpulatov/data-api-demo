import {officeContext} from '../office/office-context';
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

const URL = `${window.location.href}`;
const IS_LOCALHOST = URL.includes('localhost');

class PopupController {
  runPopupNavigation = async () => {
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
      Excel.run(async (context) => {
        const officeObject = officeContext.getOffice();
        officeObject.context.ui.displayDialogAsync(
            splittedUrl[0]
          + '?popupType=' + PopupTypeEnum.navigationTree
          + '&envUrl=' + session.url
          + '&token=' + session.authToken,
            {height: 80, width: 80, displayInIframe: true},
            (asyncResult) => {
              const dialog = asyncResult.value;
              dialog.addEventHandler(
                  officeObject.EventType.DialogMessageReceived,
                  this.onMessageFromPopup.bind(null, dialog));
              reduxStore.dispatch({type: CLEAR_WINDOW});
            });
        await context.sync();
      });
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  };

  onMessageFromPopup = async (dialog, arg) => {
    const message = arg.message;
    const response = JSON.parse(message);
    try {
      switch (response.command) {
        case selectorProperties.commandOk:
          if (response.chosenObject) {
            const result = await officeDisplayService.printObject(response.chosenObject, response.chosenProject);
            if (result) {
              notificationService.displayMessage(result.type, result.message);
            }
          }
          dialog.close();
          break;
        case selectorProperties.commandOnUpdate:
          if (response.reportId
            && response.projectId
            && response.reportSubtype
            && response.body) {
            const result = await officeDisplayService.printObject(response.reportId,
                response.projectId,
                response.reportSubtype === objectTypes.getTypeValues('Report').subtype,
                null, null, null,
                response.body);
            if (result) {
              notificationService.displayMessage(result.type, result.message);
            }
          }
          dialog.close();
          break;
        case selectorProperties.commandCancel:
          dialog.close();
          break;
        default:
          dialog.close();
          break;
      }
    } catch (error) {
      console.error(error.message);
      errorService.handleOfficeError(error);
    } finally {
      dialog.close();
    }
  }
}

export const popupController = new PopupController();
