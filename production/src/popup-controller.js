import { officeContext } from './office/office-context';
import { selectorProperties } from './attribute-selector/selector-properties';
import { officeDisplayService } from './office/office-display-service';
import { PopupTypeEnum } from './home/popup-type-enum';
import { sessionHelper } from './storage/session-helper';

class PopupController {
  runPopupNavigation = () => {
    const session = sessionHelper.getSession();
    console.log(window.location);
    const url = `${window.location.href}`;
    const prepUrl = url.replace('index.html', 'popup.html');
    console.log(prepUrl);
    Excel.run(async (context) => {
      const officeObject = officeContext.getOffice();
      officeObject.context.ui.displayDialogAsync(
        prepUrl
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
      case selectorProperties.commandSecondary:
        await dialog.close();

        await setTimeout(2000);
        debugger;
        const session = sessionHelper.getSession();

        this.runPopupNavigation();

        // const test = environment.scheme;
        // debugger;
        // officeContext.getOffice().context.ui.displayDialogAsync(
        //     `${environment.scheme}://${environment.host}:${environment.port}/popup.html`
        //     + '?envUrl=' + session.url
        //     + '&token=' + session.authToken
        //     + '&projectId=' + response.chosenProject
        //     + '&reportId=' + response.chosenObject,
        //     { height: 62, width: 50, displayInIframe: true },
        //     (asyncResult) => {
        //         this.dialog = asyncResult.value;
        //         this.dialog.addEventHandler(
        //             officeContext.getOffice()
        //                 .EventType.DialogMessageReceived,
        //             this.onMessageFromPopup);
        //     });
        // await context.sync();
        // });
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
