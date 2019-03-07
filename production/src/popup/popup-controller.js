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

class PopupController {
  runPopupNavigation = () => {
    this.runPopup(PopupTypeEnum.navigationTree, 80);
  };

  runPopup = (popupType, size) => {
    const session = sessionHelper.getSession();
    let url = `${window.location.href}`;
    if (url.search('localhost') !== -1) {
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
          + '?popupType=' + popupType
          + '&envUrl=' + session.url
          + '&token=' + session.authToken,
            {height: size, width: size, displayInIframe: true},
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
      console.error(error);
    }
  };

  onMessageFromPopup = async (dialog, arg) => {
    const message = arg.message;
    const response = JSON.parse(message);
    switch (response.command) {
      case selectorProperties.commandOk:
        await this.handleOkCommand(response, dialog);
        break;
      case selectorProperties.commandOnUpdate:
        await this.handleUpdateCommand(response, dialog);
        break;
      case selectorProperties.commandCancel:
        dialog.close();
        break;
      case selectorProperties.commandError:
        const error = errorService.errorRestFactory(response.error);
        errorService.handleError(error, false);
        dialog.close();
        break;
      default:
        break;
    }
  }

  handleUpdateCommand = async (response, dialog) => {
    if (response.reportId
      && response.projectId
      && response.reportSubtype
      && response.body) {
      const result = await officeDisplayService.printObject(response.reportId, response.projectId, response.reportSubtype === objectTypes.getTypeValues('Report').subtype, null, null, null, response.body);
      if (result) {
        notificationService.displayMessage(result.type, result.message);
      }
    }
    dialog.close();
  }

  handleOkCommand = async (response, dialog) => {
    if (response.chosenObject) {
      const result = await officeDisplayService.printObject(response.chosenObject, response.chosenProject, response.reportSubtype === objectTypes.getTypeValues('Report').subtype);
      if (result) {
        notificationService.displayMessage(result.type, result.message);
      }
    }
    dialog.close();
  }

  _sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  loadPending = (wrapped, milliseconds = 500) => {
    return async (...args) => {
      await this._sleep(milliseconds);
      this.runPopup(PopupTypeEnum.loadingPage, 20);
      return await wrapped.apply(this, args);
    };
  }
}

export const popupController = new PopupController();
export const loadPending = popupController.loadPending;
