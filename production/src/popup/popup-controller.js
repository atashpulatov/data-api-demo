import { officeContext } from '../office/office-context';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { officeDisplayService } from '../office/office-display-service';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { sessionHelper } from '../storage/session-helper';

class PopupController {
  runPopupNavigation = () => {
    const session = sessionHelper.getSession();
    console.log(window.location);
    let url = `${window.location.href}`;
    if (url.search('localhost')) {
      console.log('in if');
      url = `${window.location.origin}/popup.html`;
    } else {
      url = url.replace('index.html', 'popup.html');
    }
    const splittedUrl = url.split('?'); // we need to get rid of any query params
    Excel.run(async (context) => {
      const officeObject = officeContext.getOffice();
      officeObject.context.ui.displayDialogAsync(
        splittedUrl[0]
        + '?popupType=' + PopupTypeEnum.navigationTree
        + '&envUrl=' + session.url
        + '&token=' + session.authToken,
        { height: 80, width: 80, displayInIframe: true },
        (asyncResult) => {
          const dialog = asyncResult.value;
          dialog.addEventHandler(
            officeObject.EventType.DialogMessageReceived,
            this.onMessageFromPopup.bind(null, dialog));
        });
      await context.sync();
    });
  }

  onMessageFromPopup = async (dialog, arg) => {
    const message = arg.message;
    const response = JSON.parse(message);
    switch (response.command) {
      case selectorProperties.commandOk:
        if (response.chosenObject) {
          officeDisplayService.printObject(response.chosenObject, response.chosenProject);
        }
        dialog.close();
        break;
      case selectorProperties.commandCancel:
        dialog.close();
        break;
      default:
        break;
    }
  }
};

export const popupController = new PopupController();
