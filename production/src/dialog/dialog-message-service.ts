import { Action } from 'redux';

import { authenticationHelper } from '../authentication/authentication-helper';
import { errorService } from '../error/error-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import { dialogControllerHelper } from './dialog-controller-helper';
import overviewHelper from './overview/overview-helper';

import { reduxStore } from '../store';

import { DialogToOpen } from '../redux-reducer/office-reducer/office-reducer-types';
import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { DialogCommands, DialogResponse, ReportParams } from './dialog-controller-types';
import { OverviewActionCommands } from './overview/overview-types';

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

class DialogMessageService {
  onMessageFromDialog = async (
    dialog: Office.Dialog,
    reportParams: ReportParams,
    arg: any,
    setReportParams: (reportParams: ReportParams) => void
  ): Promise<void> => {
    const isMultipleRepromptQueueEmpty = dialogControllerHelper.getIsMultipleRepromptQueueEmpty();
    const dialogType = reduxStore.getState().popupStateReducer.popupType;
    const { isDataOverviewOpen } = reduxStore.getState().popupStateReducer;
    const { message } = arg;
    const response: DialogResponse = JSON.parse(message);
    const { command } = response;

    const isMultipleRepromptQueueEmptyAndOverviewClosed =
      isMultipleRepromptQueueEmpty && !isDataOverviewOpen;

    if (command === DialogCommands.COMMAND_DIALOG_LOADED) {
      reduxStore.dispatch(officeActions.setIsDialogLoaded(true));
      return;
    }

    if (command === DialogCommands.COMMAND_CLOSE_DIALOG) {
      dialogControllerHelper.closeDialog(dialog);
      dialogControllerHelper.resetDialogStates();
    }

    if (command === DialogCommands.COMMAND_EXECUTE_NEXT_REPROMPT_TASK) {
      reduxStore.dispatch(executeNextRepromptTask());

      // If multiple reprompt queue is not empty, stop method here to prevent closing dialog.
      if (!isMultipleRepromptQueueEmpty) {
        return;
      }
    }

    try {
      if (isMultipleRepromptQueueEmptyAndOverviewClosed) {
        dialogControllerHelper.closeDialog(dialog);
      }

      if (command !== DialogCommands.COMMAND_ERROR) {
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
        case DialogCommands.COMMAND_OK:
          await this.onCommandOk(response, reportParams);
          break;
        case DialogCommands.COMMAND_ON_UPDATE:
          await this.onCommandUpdate(response, reportParams);
          break;
        case DialogCommands.COMMAND_CANCEL:
          await this.manageDialogType(
            isMultipleRepromptQueueEmpty,
            isDataOverviewOpen,
            dialog,
            dialogType
          );
          break;
        case DialogCommands.COMMAND_ERROR:
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
      if (
        isDataOverviewOpen &&
        isMultipleRepromptQueueEmpty &&
        command !== DialogCommands.COMMAND_ERROR
      ) {
        reduxStore.dispatch(
          officeActions.setDialogToOpen(DialogToOpen.IMPORTED_DATA_OVERVIEW_POPUP)
        );
        dialogControllerHelper.clearPopupStateIfNeeded();
      }
    } catch (error) {
      console.error(error);
      errorService.handleError(error, { dialogType });
    } finally {
      // always reset this.reportParams to prevent reusing old references in future popups
      setReportParams(null);
      if (isMultipleRepromptQueueEmptyAndOverviewClosed) {
        // We will only reset popup related states when not in Multiple Reprompt workflow
        // or if the Multiple Reprompt queue has been cleared up.
        dialogControllerHelper.resetDialogStates();
      }
    }
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

    if (reportParams.isDuplicate) {
      return reduxStore.dispatch(
        duplicateRequested(reportParams.object, response.objectsDialogInfo[0])
      );
    }

    const reportPreviousState = dialogControllerHelper.getObjectPreviousState(reportParams);
    return reduxStore.dispatch(editRequested(reportPreviousState, response.objectsDialogInfo[0]));
  };

  /**
   * Method used for handling the 'update' command sent from the dialog.
   *
   * @param response Message received from the dialog
   * @param reportParams Contains information about the currently selected object
   */
  // TODO remove returns
  onCommandUpdate = async (
    response: DialogResponse,
    reportParams: ReportParams
  ): Promise<void | Action> => {
    const { objectWorkingId } = response.objectsDialogInfo[0];

    const shouldRemovePages = pageByHelper.getShouldRemovePages(
      response.objectsDialogInfo[0],
      reportParams
    );

    if (shouldRemovePages && objectWorkingId) {
      pageByHelper.handleRemovingMultiplePages(objectWorkingId);
    }

    if (!reportParams || shouldRemovePages) {
      return dialogControllerHelper.handleUpdateCommand(response.objectsDialogInfo[0]);
    }

    if (reportParams.isDuplicate) {
      return reduxStore.dispatch(
        duplicateRequested(reportParams.object, response.objectsDialogInfo[0])
      );
    }

    const reportPreviousState = dialogControllerHelper.getObjectPreviousState(reportParams);
    return reduxStore.dispatch(editRequested(reportPreviousState, response.objectsDialogInfo[0]));
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
      // @ts-expect-error
      reduxStore.dispatch(popupStateActions.setPopupType(DialogType.importedDataOverview));
    }
  };
}

export const dialogMessageService = new DialogMessageService();
