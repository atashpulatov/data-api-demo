import {
  GlobalNotificationTypes,
  ObjectNotificationTypes,
  PageByRefreshFailedOptions,
  PopupTypes,
} from '@mstr/connector-components';

import { notificationService } from '../../notification/notification-service';
import { officeApiService } from '../../office/api/office-api-service';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { pageByHelper } from '../../page-by/page-by-helper';
import { operationService } from '../../redux-reducer/operation-reducer/operation-service';
import { sidePanelHelper } from '../../right-side-panel/side-panel-services/side-panel-helper';
import { sidePanelService } from '../../right-side-panel/side-panel-services/side-panel-service';
import { dialogHelper } from '../dialog-helper';

import { reduxStore } from '../../store';

import {
  GlobalNotification,
  Notification,
} from '../../redux-reducer/notification-reducer/notification-reducer-types';
import { DialogToOpen } from '../../redux-reducer/office-reducer/office-reducer-types';
import { DialogPopup, OverviewActionCommands } from './overview-types';

import i18n from '../../i18n';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { clearGlobalNotification } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { removeObject } from '../../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { cancelOperationByOperationId } from '../../redux-reducer/operation-reducer/operation-actions';
import { executeNextRepromptTask } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import {
  NotificationButtonsProps,
  OverviewGlobalNotificationButtons,
} from './overview-global-notification-buttons';
import { ObjectImportType, objectImportTypeDictionary } from '../../mstr-object/constants';

class OverviewHelper {
  /**
   * Sends message with import command to the Side Panel
   *
   */
  async sendImportRequest(): Promise<void> {
    dialogHelper.officeMessageParent({ command: OverviewActionCommands.IMPORT });
  }

  /**
   * Sends message with edit command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the objects allowing to reference specific objects
   */
  async sendEditRequest(objectWorkingId: number): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.EDIT,
      objectWorkingId,
    });
  }

  /**
   * Sends message with reprompt command to the Side Panel
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendRepromptRequest(objectWorkingIds: number[]): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.REPROMPT,
      objectWorkingIds,
    });
  }

  /**
   * Sends message with refresh command to the Side Panel
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendRefreshRequest(objectWorkingIds: number[]): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.REFRESH,
      objectWorkingIds,
    });
  }

  /**
   * Sends message with delete command to the Side Panel
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendDeleteRequest(objectWorkingIds: number[]): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.REMOVE,
      objectWorkingIds,
    });
  }

  /**
   * Sends message with dismiss notification command to the Side Panel
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   * @param operationId Unique Id of the operation allowing to reference specific operation
   */
  async sendDismissNotificationRequest(
    objectWorkingIds: number[],
    operationId: string
  ): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds,
      operationId,
    });
  }

  /**
   * Sends message with dismiss removed objects command to the Side Panel
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   * @param operationId Unique Id of the operation allowing to reference specific operation
   */
  async sendDismissRemovedObjectsRequest(
    objectWorkingIds: number[],
    operationId: string
  ): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.DISMISS_REMOVED_OBJECT,
      objectWorkingIds,
      operationId,
    });
  }

  /**
   * Sends message with dismiss global notification command to the Side Panel
   *
   */
  async sendDismissGlobalNotificationRequest(): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.DISMISS_GLOBAL_NOTIFICATION,
    });
  }

  /**
   * Sends message with duplicate command to the Side Panel
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   * @param insertNewWorksheet Flag indicating whether new worksheet should be inserted
   * @param withEdit Flag indicating whether duplicate should be performed with edit
   */
  sendDuplicateRequest(
    objectWorkingIds: number[],
    insertNewWorksheet: boolean,
    withEdit: boolean
  ): void {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.DUPLICATE,
      objectWorkingIds,
      insertNewWorksheet,
      withEdit,
    });
  }

  /**
   * Sends message with rangeTakenOk command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handleRangeTakenOk = (objectWorkingId: number): void => {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.RANGE_TAKEN_OK,
      objectWorkingId,
    });
  };

  /**
   * Sends message with rangeTakenClose command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handleRangeTakenClose = (objectWorkingId: number): void => {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.RANGE_TAKEN_CLOSE,
      objectWorkingId,
    });
  };

  /**
   * Sends message with pageByRefreshFailedClose command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handlePageByRefreshFailedClose = (objectWorkingId: number): void => {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.PAGE_BY_REFRESH_FAILED_CLOSE,
      objectWorkingId,
    });
  };

  /**
   * Sends message with handlePageByDuplicateFailedClose command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handlePageByDuplicateFailedClose = (objectWorkingId: number): void => {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.PAGE_BY_DUPLICATE_FAILED_CLOSE,
      objectWorkingId,
    });
  };

  /**
   * Sends message with handlePageByImportFailedClose command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handlePageByImportFailedClose = (objectWorkingId: number): void => {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.PAGE_BY_IMPORT_FAILED_CLOSE,
      objectWorkingId,
    });
  };

  /**
   * Sends message with pageByRefreshFailedEdit command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handlePageByRefreshFailedEdit = (objectWorkingId: number): void => {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.PAGE_BY_REFRESH_FAILED_EDIT,
      objectWorkingId,
    });
  };

  /**
   * Sends message with handlePageByRefreshFailedRemove command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handlePageByRefreshFailedRemove = (objectWorkingId: number): void => {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.PAGE_BY_REFRESH_FAILED_REMOVE,
      objectWorkingId,
    });
  };

  /**
   * Sends message with rename command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param newName Updated name of the renamed object
   */
  async sendRenameRequest(objectWorkingId: number, newName: string): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.RENAME,
      objectWorkingId,
      newName,
    });
  }

  /**
   * Sends message with goToWorksheet command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  async sendGoToWorksheetRequest(objectWorkingId: number): Promise<void> {
    dialogHelper.officeMessageParent({
      command: OverviewActionCommands.GO_TO_WORKSHEET,
      objectWorkingId,
    });
  }

  /**
   * Handles dismissing object notifications for given objectWorkingIds
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   * @param operationId Unique Id of the operation allowing to reference specific operation
   */
  handleDismissNotifications = (objectWorkingIds: number[], operationId: string): void => {
    operationId && reduxStore.dispatch(cancelOperationByOperationId(operationId));
    objectWorkingIds?.forEach(objectWorkingId => {
      notificationService.removeExistingNotification(objectWorkingId);
    });
  };

  /**
   * Handles dismissing removed object for given objectWorkingIds
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   * @param operationId Unique Id of the operation allowing to reference specific operation
   */
  handleDismissRemovedObjects = (objectWorkingIds: number[], operationId: string): void => {
    operationId && reduxStore.dispatch(cancelOperationByOperationId(operationId));
    objectWorkingIds?.forEach(objectWorkingId => {
      notificationService.removeExistingNotification(objectWorkingId);
      reduxStore.dispatch(removeObject(objectWorkingId));
    });
  };

  /**
   * Handles proper Overview dialog action command based on the response
   *
   * @param response Response from the Overview dialog
   */
  async handleOverviewActionCommand(response: {
    command: OverviewActionCommands;
    objectWorkingId?: number;
    objectWorkingIds?: number[];
    operationId?: string;
    insertNewWorksheet?: boolean;
    withEdit?: boolean;
    newName?: string;
  }): Promise<void> {
    const { callback } = reduxStore.getState().officeReducer?.popupData || {};

    switch (response.command) {
      case OverviewActionCommands.IMPORT:
        reduxStore.dispatch(officeActions.setDialogToOpen(DialogToOpen.POPUP_NAVIGATION));
        break;
      case OverviewActionCommands.EDIT:
        await sidePanelService.edit(response.objectWorkingId);
        break;
      case OverviewActionCommands.REPROMPT:
        sidePanelService.reprompt(response.objectWorkingIds, true);
        break;
      case OverviewActionCommands.REFRESH:
        sidePanelService.refresh(...response.objectWorkingIds);
        break;
      case OverviewActionCommands.REMOVE:
        sidePanelService.remove(...response.objectWorkingIds);
        break;
      case OverviewActionCommands.DUPLICATE:
        response.objectWorkingIds.forEach(objectWorkingId => {
          sidePanelHelper.duplicateObject(
            objectWorkingId,
            response.insertNewWorksheet,
            response.withEdit
          );
        });
        break;
      case OverviewActionCommands.RANGE_TAKEN_OK:
        operationService.importInNewRange(response.objectWorkingId, null, true);
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.RANGE_TAKEN_CLOSE:
        await callback();

        reduxStore.dispatch(executeNextRepromptTask());
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.PAGE_BY_REFRESH_FAILED_CLOSE:
      case OverviewActionCommands.PAGE_BY_DUPLICATE_FAILED_CLOSE:
        notificationService.clearPopupDataAndRunCallback(callback);
        break;
      case OverviewActionCommands.PAGE_BY_IMPORT_FAILED_CLOSE:
        await operationService.revertPageByImportForSiblings(response.objectWorkingId);
        notificationService.clearPopupDataAndRunCallback(callback);
        break;
      case OverviewActionCommands.PAGE_BY_REFRESH_FAILED_EDIT:
        notificationService.clearPopupDataAndRunCallback(callback);
        await sidePanelService.edit(response.objectWorkingId);
        break;
      case OverviewActionCommands.PAGE_BY_REFRESH_FAILED_REMOVE:
        notificationService.clearPopupDataAndRunCallback(callback);
        pageByHelper.handleRemovingMultiplePages(response.objectWorkingId);
        break;
      case OverviewActionCommands.RENAME:
        sidePanelService.rename(response.objectWorkingId, response.newName);
        break;
      case OverviewActionCommands.GO_TO_WORKSHEET:
        sidePanelService.highlightObject(response.objectWorkingId);
        break;
      case OverviewActionCommands.DISMISS_NOTIFICATION:
        this.handleDismissNotifications(response.objectWorkingIds, response.operationId);
        break;
      case OverviewActionCommands.DISMISS_REMOVED_OBJECT:
        this.handleDismissRemovedObjects(response.objectWorkingIds, response.operationId);
        break;
      case OverviewActionCommands.DISMISS_GLOBAL_NOTIFICATION:
        reduxStore.dispatch(clearGlobalNotification());
        break;
      default:
        console.warn('Unhandled dialog command: ', response.command);
        break;
    }
  }

  /**
   * Transforms Excel objects and notifications into a format that can be displayed in the Overview dialog grid
   *
   * @param objects Imported objects data
   * @param notifications Objects notifications
   *
   * @returns Transformed objects
   */
  // TODO add types once redux state is typed
  transformExcelObjects(objects: any[], notifications: any[]): any[] {
    return objects.map(object => {
      const {
        objectWorkingId,
        mstrObjectType,
        name,
        refreshDate,
        details,
        importType,
        startCell,
        worksheet,
        pageByData,
        definition,
      } = object;

      const objectNotification = notifications.find(
        notification => notification.objectWorkingId === objectWorkingId
      );
      let isPrompted = false;

      // Determine if object is prompted if it is a dossier/visualization or a report
      if (
        mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name ||
        mstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name
      ) {
        isPrompted = !!object.manipulationsXML?.promptAnswers;
      } else if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name) {
        isPrompted = object.isPrompted;
      }

      return {
        objectWorkingId,
        mstrObjectType,
        name,
        worksheet: worksheet?.name,
        cell: startCell,
        rows: details?.excelTableSize?.rows,
        columns: details?.excelTableSize?.columns,
        objectType: objectImportTypeDictionary[importType as ObjectImportType],
        lastUpdated: refreshDate,
        status: {
          type: objectNotification?.type,
          title: objectNotification?.title,
          details: objectNotification?.details,
        },
        project: details?.ancestors?.[0]?.name,
        owner: details?.owner?.name,
        importedBy: details?.importedBy,
        isPrompted,
        ...(pageByData && {
          pageByData,
          pageByLinkId: pageByData?.pageByLinkId,
          sourceName: definition?.sourceName,
        }),
        ...(mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name && {
          sourceName: definition?.sourceName,
        }),
      };
    });
  }

  /**
   * Sets Duplicate popup for Overview dialog
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param activeCellAddress Address of the active cell in Excel
   * @param onDuplicate Function used for triggering duplicate operation
   * @param setDialogPopup Function used as a callback for seting Overview dialog popup
   */
  setDuplicatePopup({
    objectWorkingIds,
    activeCellAddress,
    onDuplicate,
    setDialogPopup,
  }: DialogPopup): void {
    const sourceObject = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(
      objectWorkingIds[0]
    );
    const isPageByObject = !!sourceObject?.pageByData?.pageByLinkId;

    const onEdit = (isActiveCellOptionSelected: boolean): void => {
      onDuplicate(objectWorkingIds, !isActiveCellOptionSelected, true);
      setDialogPopup(null);
    };

    setDialogPopup({
      type: PopupTypes.DUPLICATE,
      activeCell: officeApiService.getCellAddressWithDollars(activeCellAddress),
      onImport: isActiveCellOptionSelected => {
        onDuplicate(objectWorkingIds, !isActiveCellOptionSelected, false);
        setDialogPopup(null);
      },
      onEdit: !isPageByObject
        ? isActiveCellOptionSelected => onEdit(isActiveCellOptionSelected)
        : undefined,
      onClose: () => setDialogPopup(null),
    });
  }

  /**
   * Sets Range Taken popup for Overview dialog
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param setDialogPopup Function used as a callback for seting Overview dialog popup
   */
  setRangeTakenPopup({ objectWorkingIds, setDialogPopup }: DialogPopup): void {
    setDialogPopup({
      type: PopupTypes.RANGE_TAKEN_OVERVIEW,
      onOk: () => {
        this.handleRangeTakenOk(objectWorkingIds[0]);
        officeReducerHelper.clearPopupData();
      },
      onClose: () => {
        this.handleRangeTakenClose(objectWorkingIds[0]);
        officeReducerHelper.clearPopupData();
      },
    });
  }

  /**
   * Sets Range Taken popup for Overview dialog
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param setDialogPopup Function used as a callback for seting Overview dialog popup
   */
  setPageByRefreshFailedPopup({ objectWorkingIds, setDialogPopup }: DialogPopup): void {
    const onCancel = (): void => {
      this.handlePageByRefreshFailedClose(objectWorkingIds[0]);
      officeReducerHelper.clearPopupData();
    };

    const onOk = (refreshFailedOptions: PageByRefreshFailedOptions): void => {
      switch (refreshFailedOptions) {
        case PageByRefreshFailedOptions.EDIT_AND_REIMPORT:
          this.handlePageByRefreshFailedEdit(objectWorkingIds[0]);
          break;
        case PageByRefreshFailedOptions.DELETE_FROM_WORKSHEET:
          this.handlePageByRefreshFailedRemove(objectWorkingIds[0]);
          break;
        default:
          break;
      }
    };

    setDialogPopup({
      type: PopupTypes.FAILED_TO_REFRESH_PAGES_OVERVIEW,
      onOk: (refreshFailedOptions: PageByRefreshFailedOptions): void => onOk(refreshFailedOptions),
      onClose: onCancel,
    });
  }

  /**
   * Sets page by duplicate error popup for Overview dialog
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   * @param setDialogPopup Function used as a callback for seting Overview dialog popup
   * @param selectedObjects Objects that are failed to duplicate
   */
  setPageByDuplicateFailedPopup({
    objectWorkingIds,
    setDialogPopup,
    selectedObjects,
  }: DialogPopup): void {
    const onOk = (): void => {
      this.handlePageByDuplicateFailedClose(objectWorkingIds[0]);
      officeReducerHelper.clearPopupData();
    };

    setDialogPopup({
      type: PopupTypes.FAILED_TO_DUPLICATE,
      selectedObjects,
      onOk,
    });
  }

  /**
   * Creates pageby import failed popup.
   *
   * @param data  Data required to create and update pageby refresh failed popup.
   * @param data.objectWorkingId  Uniqe id of source object for duplication.
   * @param data.setDialogPopup Callback to save popup in state of RightSidePanel.
   * @param data.errorDetails  Details of the error that occurred during import.
   */
  setPageByImportFailedPopup = ({
    objectWorkingIds,
    setDialogPopup,
    errorDetails,
  }: {
    objectWorkingIds: number[];
    setDialogPopup: Function;
    errorDetails: string;
  }): void => {
    const onOk = async (): Promise<void> => {
      this.handlePageByImportFailedClose(objectWorkingIds[0]);
    };

    setDialogPopup({
      type: PopupTypes.FAILED_TO_IMPORT,
      errorDetails,
      onOk,
    });
  };

  /**
   * Gets warning notification to display as global warnings in the Overview dialog
   * @param notifications Array of notifications
   * @param globalNotification Global notification object
   *
   * @returns Array of notifications to display as global Notifications in overview dialog
   */
  // TODO: Add types once redux state is typed
  getWarningsToDisplay = ({
    notifications,
    globalNotification,
  }: {
    notifications?: Notification[];
    globalNotification?: GlobalNotification;
  }): any => {
    const { t } = i18n;

    const isGlobalWarning = globalNotification?.type === GlobalNotificationTypes.GLOBAL_WARNING;
    const warningNotifications = notifications?.filter(
      notification => notification.type === ObjectNotificationTypes.WARNING
    );

    const modifiedWarnings = warningNotifications?.map(warning => {
      const buttonProps = {
        buttons: [
          {
            label: t('OK'),
            onClick: () =>
              this.sendDismissNotificationRequest([warning.objectWorkingId], warning.operationId),
          },
        ],
      } as NotificationButtonsProps;
      return {
        ...warning,
        children: OverviewGlobalNotificationButtons({ ...buttonProps }),
      };
    });

    const globalNotificationButtons = {
      buttons: [
        {
          label: t('OK'),
          onClick: () => this.sendDismissGlobalNotificationRequest(),
        },
      ],
    } as NotificationButtonsProps;
    const modifiedGlobalNotification = isGlobalWarning
      ? [
          {
            ...globalNotification,
            children: OverviewGlobalNotificationButtons({
              ...globalNotificationButtons,
            }),
          },
        ]
      : null;

    return modifiedGlobalNotification || modifiedWarnings;
  };
}

const overviewHelper = new OverviewHelper();
export default overviewHelper;
