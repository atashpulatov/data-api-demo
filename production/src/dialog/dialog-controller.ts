import { authenticationHelper } from '../authentication/authentication-helper';
import { errorService } from '../error/error-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import { dialogControllerHelper } from './dialog-controller-helper';
import { dialogMessageService } from './dialog-message-service';

import { reduxStore } from '../store';

import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { ReportParams } from './dialog-controller-types';

import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { clearRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';

const URL = `${window.location.href}`;

class DialogController {
  reportParams = null as ReportParams;

  dialog = {} as Office.Dialog;

  setReportParams = (reportParams: ReportParams): void => {
    this.reportParams = reportParams;
  };

  runPopupNavigation = async (): Promise<void> => {
    dialogControllerHelper.clearPopupStateIfNeeded();
    await this.runPopup(DialogType.libraryWindow, 80, 80);
  };

  runEditFiltersPopup = async (reportParams: ReportParams): Promise<void> => {
    await this.runPopup(DialogType.editFilters, 80, 80, reportParams);
  };

  /**
   * This method is used to run the Report's re-prompt popup from the Excel add-in.
   * Note that both the Edit and Reprompt workflows will call this function.
   * The isEdit parameter determines whether the Reprompt screen should
   * be followed by the Edit Filters screen.
   * @param reportParams
   * @param isEdit
   */
  runRepromptPopup = async (reportParams: ReportParams): Promise<void> => {
    const { popupType } = reduxStore.getState().popupStateReducer;
    const { isEdit } = reduxStore.getState().popupReducer;
    const isOverviewReprompt = popupType && popupType === DialogType.repromptReportDataOverview;
    // @ts-expect-error
    reduxStore.dispatch(popupStateActions.setMstrData({ isReprompt: true, isEdit }));
    await this.runPopup(
      isOverviewReprompt ? popupType : DialogType.repromptingWindow,
      80,
      80,
      reportParams
    );
  };

  /**
   * This method is used to run the Dossier's re-prompt popup from the Excel add-in
   * @param reportParams
   */
  runRepromptDossierPopup = async (reportParams: any): Promise<void> => {
    const { popupType } = reduxStore.getState().popupStateReducer;
    const isOverviewReprompt = popupType && popupType === DialogType.repromptDossierDataOverview;
    // @ts-expect-error
    reduxStore.dispatch(popupStateActions.setMstrData({ isReprompt: true }));
    await this.runPopup(
      isOverviewReprompt ? popupType : DialogType.dossierWindow,
      80,
      80,
      reportParams
    );
  };

  runEditDossierPopup = async (reportParams: ReportParams): Promise<void> => {
    await this.runPopup(DialogType.dossierWindow, 80, 80, reportParams);
  };

  runImportedDataOverviewPopup = async (): Promise<void> => {
    dialogControllerHelper.clearPopupStateIfNeeded();
    await this.runPopup(DialogType.importedDataOverview, 80, 80, null);
  };

  runPopup = async (
    popupType: string,
    height: number,
    width: number,
    reportParams: ReportParams = null
  ): Promise<void> => {
    const isDialogForMultipleRepromptOpen =
      dialogControllerHelper.getIsDialogAlreadyOpenForMultipleReprompt();
    const { isDataOverviewOpen } = reduxStore.getState().popupStateReducer;
    const isRepromptOrOvieviewPopupOpen = isDialogForMultipleRepromptOpen || isDataOverviewOpen;

    // @ts-expect-error
    reduxStore.dispatch(popupStateActions.setMstrData({ popupType }));
    this.reportParams = reportParams;

    const url = URL;
    const splittedUrl = url.split('?'); // we need to get rid of any query params

    try {
      await authenticationHelper.validateAuthToken();
      await officeApiHelper.getExcelSessionStatus();
      if (isRepromptOrOvieviewPopupOpen) {
        // US530793: If dialog already open, send message to dialog to reload with new object data.
        // This only occurs during Multiple Reprompt workflow.
        this.sendMessageToDialog(
          JSON.stringify({
            splittedUrl,
            popupType,
            isRepromptOrOvieviewPopupOpen,
          })
        );
      } else {
        // Otherwise, open new dialog and assign event handlers
        console.time('Popup load time');
        Office.context.ui.displayDialogAsync(
          `${splittedUrl[0]}?popupType=${popupType}&source=addin-mstr-excel`,
          { height, width, displayInIframe: true },
          asyncResult => {
            const { value: dialog } = asyncResult;
            if (dialog) {
              this.dialog = dialog;
              console.timeEnd('Popup load time');

              dialog.addEventHandler(
                // Event received on message from parent (sidebar)
                Office.EventType.DialogMessageReceived,
                // Trigger onMessageFromPopup callback with most current reportParams object
                arg =>
                  dialogMessageService.onMessageFromDialog(
                    dialog,
                    this.reportParams,
                    arg,
                    this.setReportParams
                  )
              );

              dialog.addEventHandler(
                // Event received on dialog close
                Office.EventType.DialogEventReceived,
                () => {
                  reduxStore.dispatch(popupActions.resetState());
                  // @ts-expect-error
                  reduxStore.dispatch(popupStateActions.onClearPopupState());
                  // @ts-expect-error
                  reduxStore.dispatch(officeActions.hideDialog());

                  // Clear the reprompt task queue if the user closes the popup,
                  // as the user is no longer interested in continuing the multiple re-prompting task.
                  reduxStore.dispatch(clearRepromptTask());
                }
              );

              reduxStore.dispatch(officeActions.showDialog());
            }
          }
        );
      }
    } catch (error) {
      errorService.handleError(error);
    }
  };

  sendMessageToDialog = (message: string): void => {
    this.dialog?.messageChild && this.dialog?.messageChild(message);
  };

  loadPending =
    (wrapped: any) =>
    async (...args: any) => {
      this.runPopup(DialogType.loadingPage, 30, 40);
      return wrapped(...args);
    };
}

export const dialogController = new DialogController();
export const { loadPending } = dialogController;
