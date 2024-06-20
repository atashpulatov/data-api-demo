import { Action } from 'redux';

import { authenticationHelper } from '../authentication/authentication-helper';
import { errorService } from '../error/error-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import { dialogControllerHelper } from './dialog-controller-helper';
import overviewHelper, { OverviewActionCommands } from './overview/overview-helper';

import { reduxStore } from '../store';

import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { DialogResponse, ReportParams } from './dialog-controller-types';

import { selectorProperties } from '../attribute-selector/selector-properties';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import {
  duplicateRequested,
  editRequested,
} from '../redux-reducer/operation-reducer/operation-actions';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import {
  clearRepromptTask,
  executeNextRepromptTask,
} from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';

const URL = `${window.location.href}`;

class DialogController {
  reportParams = null as ReportParams;

  dialog = {} as Office.Dialog;

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
  runRepromptPopup = async (reportParams: any, isEdit = true): Promise<void> => {
    const { popupType } = reduxStore.getState().popupStateReducer;
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
                arg => this.onMessageFromPopup(dialog, this.reportParams, arg)
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

  /**
   * It indicates when the dialog type is for multiple reprompting data for reports and/or dossiers triggered in
   * the Overview dialog and the command has to do with data overlapping in the new data range to be occupied in worksheet.
   *
   * Note: Only handling data range commands for multiple re-prompting workflow in the Overview dialog, rather than delegating all
   * possible commands associated with re-prompting. This approach minimizes the risk of introducing bugs in the future by
   * limiting scope to data range overlapping commands only.
   *
   * @param dialogType - indicates type of the dialog to be opened, value from DialogType
   * @param command - action command from the dialog
   * @returns boolean - true if the command is either RANGE_TAKEN_OK or RANGE_TAKEN_CLOSE and re-prompt in Overview dialog.
   */
  isDataRangeCommandForMultipleRepromptDialogInOverview(
    dialogType: DialogType,
    command: string
  ): boolean {
    const { RANGE_TAKEN_CLOSE, RANGE_TAKEN_OK } = OverviewActionCommands;
    const validDialogTypes = [
      DialogType.repromptReportDataOverview,
      DialogType.repromptDossierDataOverview,
    ];
    // Return true to indicate that command was either RANGE_TAKEN_OK or RANGE_TAKEN_CLOSE
    // and current dialog is either repromptReportDataOverview or repromptDossierDataOverview.
    return (
      validDialogTypes.includes(dialogType) &&
      (command === RANGE_TAKEN_OK || command === RANGE_TAKEN_CLOSE)
    );
  }

  onMessageFromPopup = async (
    dialog: Office.Dialog,
    reportParams: ReportParams,
    arg: any
  ): Promise<void> => {
    const isMultipleRepromptQueueEmpty = dialogControllerHelper.getIsMultipleRepromptQueueEmpty();
    const { message } = arg;
    const response: DialogResponse = JSON.parse(message);

    const { command } = response;
    const {
      commandOk,
      commandOnUpdate,
      commandCancel,
      commandError,
      commandDialogLoaded,
      commandCloseDialog,
      commandExecuteNextRepromptTask,
    } = selectorProperties;

    const dialogType = reduxStore.getState().popupStateReducer.popupType;
    const { isDataOverviewOpen } = reduxStore.getState().popupStateReducer;

    if (command === commandDialogLoaded) {
      reduxStore.dispatch(officeActions.setIsDialogLoaded(true));
    }

    if (command === commandCloseDialog) {
      dialogControllerHelper.closeDialog(dialog);
      dialogControllerHelper.resetDialogStates();
    }

    if (command === commandExecuteNextRepromptTask) {
      reduxStore.dispatch(executeNextRepromptTask());

      // If multiple reprompt queue is not empty, stop method here to prevent closing dialog.
      if (!isMultipleRepromptQueueEmpty) {
        return;
      }
    }

    const isMultipleRepromptQueueEmptyAndOverviewClosed =
      isMultipleRepromptQueueEmpty && !isDataOverviewOpen;

    try {
      if (isMultipleRepromptQueueEmptyAndOverviewClosed) {
        // We will only close dialog if not in Multiple Reprompt workflow
        // or if the Multiple Reprompt queue has been cleared up.
        dialogControllerHelper.closeDialog(dialog);
      }
      if (command !== commandError) {
        await officeApiHelper.getExcelSessionStatus(); // checking excel session status
      }
      await authenticationHelper.validateAuthToken();

      // Attempt to delegate the response to Overview helper to handle the action command for
      // the Overview dialog, if the command is either RANGE_TAKEN_OK or RANGE_TAKEN_CLOSE and
      // the dialog type is either re-prompt for reports or dossiers triggered from Overview dialog.
      // Also, delegate the response to Overview helper if the dialog type is for imported data overview
      // (a.k.a. Overview dialog and supported actions). If any of these conditions are met, then the execution
      // of this method will be stopped here.
      if (
        dialogType === DialogType.importedDataOverview ||
        this.isDataRangeCommandForMultipleRepromptDialogInOverview(dialogType, command)
      ) {
        // @ts-expect-error
        return overviewHelper.handleOverviewActionCommand(response);
      }

      if (dialogType === DialogType.dossierWindow || dialogType === DialogType.repromptingWindow) {
        // @ts-expect-error
        await overviewHelper.handleOverviewActionCommand(response);
      }

      switch (command) {
        case commandOk:
          await this.onCommandOk(response, reportParams);
          break;
        case commandOnUpdate:
          await this.onCommandUpdate(response, reportParams);
          break;
        case commandCancel:
          await this.manageDialogType(
            isMultipleRepromptQueueEmpty,
            isDataOverviewOpen,
            dialog,
            dialogType
          );
          break;
        case commandError:
          await this.manageDialogType(
            isMultipleRepromptQueueEmpty,
            isDataOverviewOpen,
            dialog,
            dialogType
          );

          // Reset state if an error has occurred and show error message.
          if (isDataOverviewOpen) {
            reduxStore.dispatch(popupActions.resetState());
          }
          errorService.handleError(response.error);
          break;
        default:
          break;
      }

      // Only show overview table if there are no more prompted items left to Multiple Reprompt
      // This check will keep the prompts dialog open in between reports/dossiers, if there are more to prompt
      // as long as there are no errors.
      if (isDataOverviewOpen && isMultipleRepromptQueueEmpty && command !== commandError) {
        await this.runImportedDataOverviewPopup();
      }
    } catch (error) {
      console.error(error);
      errorService.handleError(error, { dialogType });
    } finally {
      // always reset this.reportParams to prevent reusing old references in future popups
      this.reportParams = null;
      if (isMultipleRepromptQueueEmptyAndOverviewClosed) {
        // We will only reset popup related states when not in Multiple Reprompt workflow
        // or if the Multiple Reprompt queue has been cleared up.
        dialogControllerHelper.resetDialogStates();
      }
    }
  };

  /**
   * Method used for handling the 'ok' command sent from the dialog.
   *
   * @param response Message received from the dialog
   * @param reportParams Contains information about the currently selected object
   */
  onCommandOk = async (
    response: DialogResponse,
    reportParams: ReportParams
  ): Promise<void | Action> => {
    if (!reportParams) {
      return dialogControllerHelper.handleOkCommand(response);
    }

    if (reportParams.duplicateMode) {
      return reduxStore.dispatch(duplicateRequested(reportParams.object, response));
    }

    const reportPreviousState = dialogControllerHelper.getObjectPreviousState(reportParams);
    return reduxStore.dispatch(editRequested(reportPreviousState, response));
  };

  /**
   * Method used for handling the 'update' command sent from the dialog.
   *
   * @param response Message received from the dialog
   * @param reportParams Contains information about the currently selected object
   */
  onCommandUpdate = async (
    response: DialogResponse,
    reportParams: ReportParams
  ): Promise<void | Action> => {
    const { objectWorkingId } = response;

    const shouldRemovePages = pageByHelper.getShouldRemovePages(response, reportParams);

    if (shouldRemovePages && objectWorkingId) {
      pageByHelper.handleRemovingMultiplePages(objectWorkingId);
    }

    if (!reportParams || shouldRemovePages) {
      return dialogControllerHelper.handleUpdateCommand(response);
    }

    if (reportParams.duplicateMode) {
      return reduxStore.dispatch(duplicateRequested(reportParams.object, response));
    }

    const reportPreviousState = dialogControllerHelper.getObjectPreviousState(reportParams);
    return reduxStore.dispatch(editRequested(reportPreviousState, response));
  };

  loadPending =
    (wrapped: any) =>
    async (...args: any) => {
      this.runPopup(DialogType.loadingPage, 30, 40);
      return wrapped(...args);
    };

  manageDialogType = async (
    isMultipleRepromptQueueEmpty: boolean,
    isDataOverviewOpen: boolean,
    dialog: Office.Dialog,
    dialogType: string
  ): Promise<void> => {
    // First, clear reprompt task queue if the user cancels the popup.
    reduxStore.dispatch(clearRepromptTask());

    if (!isMultipleRepromptQueueEmpty && !isDataOverviewOpen) {
      // Close dialog when user cancels or an error occurs, but only if there are objects left to Multiple Reprompt,
      // since we were previously keeping the dialog open in between objects.
      // Otherwise, the dialog will close and reset popup state anyway, so no need to do it here.
      dialogControllerHelper.closeDialog(dialog);
      dialogControllerHelper.resetDialogStates();
    } else if (
      isDataOverviewOpen &&
      (dialogType === DialogType.repromptDossierDataOverview ||
        dialogType === DialogType.repromptReportDataOverview ||
        dialogType === DialogType.libraryWindow)
    ) {
      // Show overview table if cancel was triggered during Multiple Reprompt workflow.
      this.runImportedDataOverviewPopup();
    }
  };
}

export const dialogController = new DialogController();
export const { loadPending } = dialogController;
