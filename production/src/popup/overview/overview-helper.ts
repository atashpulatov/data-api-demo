import {
  GlobalNotificationTypes,
  ObjectNotificationTypes,
  PageByRefreshFailedOptions,
  PopupTypes,
} from '@mstr/connector-components';

import { officeApiHelper } from '../../office/api/office-api-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { pageByHelper } from '../../page-by/page-by-helper';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-services/side-panel-notification-helper';
import { popupHelper } from '../popup-helper';

import { DialogPopup } from './overview-types';

import i18n from '../../i18n';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { executeNextRepromptTask } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import {
  NotificationButtonsProps,
  OverviewGlobalNotificationButtons,
} from './overview-global-notification-buttons';

export enum OverviewActionCommands {
  IMPORT = 'overview-import',
  EDIT = 'overview-edit',
  REFRESH = 'overview-refresh',
  REMOVE = 'overview-remove',
  DUPLICATE = 'overview-duplicate',
  REPROMPT = 'overview-reprompt',
  RANGE_TAKEN_OK = 'overview-range-taken-ok',
  RANGE_TAKEN_CLOSE = 'overview-range-taken-close',
  PAGE_BY_REFRESH_FAILED_CLOSE = 'overview-page-by-refresh-failed-close',
  PAGE_BY_REFRESH_FAILED_EDIT = 'overview-page-by-refresh-failed-edit',
  PAGE_BY_REFRESH_FAILED_REMOVE = 'overview-page-by-refresh-failed-remove',
  RENAME = 'overview-rename',
  GO_TO_WORKSHEET = 'overview-go-to-worksheet',
  DISMISS_NOTIFICATION = 'overview-dismiss-notification',
  DISMISS_GLOBAL_NOTIFICATION = 'overview-dismiss-global-notification',
}

// rewrite everything
class OverviewHelper {
  store: any;

  sidePanelService: any;

  notificationService: any;

  sidePanelHelper: any;

  init = (
    reduxStore: any,
    sidePanelService: any,
    notificationService: any,
    sidePanelHelper: any
  ): void => {
    this.store = reduxStore;
    this.sidePanelService = sidePanelService;
    this.notificationService = notificationService;
    this.sidePanelHelper = sidePanelHelper;
  };

  /**
   * Sends message with import command to the Side Panel
   *
   */
  async sendImportRequest(): Promise<void> {
    popupHelper.officeMessageParent({ command: OverviewActionCommands.IMPORT });
  }

  /**
   * Sends message with edit command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the objects allowing to reference specific objects
   */
  async sendEditRequest(objectWorkingId: number): Promise<void> {
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.REMOVE,
      objectWorkingIds,
    });
  }

  /**
   * Sends message with dismiss notification command to the Side Panel
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  async sendDismissNotificationRequest(objectWorkingIds: number[]): Promise<void> {
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.DISMISS_NOTIFICATION,
      objectWorkingIds,
    });
  }

  /**
   * Sends message with dismiss global notification command to the Side Panel
   *
   */
  async sendDismissGlobalNotificationRequest(): Promise<void> {
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.PAGE_BY_REFRESH_FAILED_CLOSE,
      objectWorkingId,
    });
  };

  /**
   * Sends message with pageByRefreshFailedEdit command to the Side Panel
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  handlePageByRefreshFailedEdit = (objectWorkingId: number): void => {
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
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
    popupHelper.officeMessageParent({
      command: OverviewActionCommands.GO_TO_WORKSHEET,
      objectWorkingId,
    });
  }

  /**
   * Handles dismissing object notifications for given objectWorkingIds
   *
   * @param objectWorkingIds Unique Ids of the objects allowing to reference specific objects
   */
  handleDismissNotifications = (objectWorkingIds: number[]): void => {
    objectWorkingIds?.forEach(objectWorkingId => {
      this.notificationService.removeExistingNotification(objectWorkingId);
    });
  };

  /**
   * Handles dismissing global notification
   *
   */
  handleDismissGlobalNotification = (): void => {
    this.notificationService.globalNotificationDissapear();
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
    insertNewWorksheet?: boolean;
    withEdit?: boolean;
    newName?: string;
  }): Promise<void> {
    // DE288915: Only trigger dismiss notifications if the command is not edit or reprompt
    // For Edit and Re-prompt, dismissal is taken care in the notification reducer itself.
    // This is to avoid dispatching notification dismissals and avoid conflicts.
    if (
      response.command !== OverviewActionCommands.EDIT &&
      response.command !== OverviewActionCommands.REPROMPT
    ) {
      this.handleDismissNotifications(response.objectWorkingIds);
    }

    // eslint-disable-next-line no-case-declarations
    const { callback } = this.store.getState().officeReducer?.popupData || {};

    switch (response.command) {
      case OverviewActionCommands.IMPORT:
        await this.sidePanelService.addData();
        break;
      case OverviewActionCommands.EDIT:
        // DE288915: Edit should not dismiss the notifications from here.
        await this.sidePanelService.edit(response.objectWorkingId);
        break;
      case OverviewActionCommands.REPROMPT:
        this.sidePanelService.reprompt(response.objectWorkingIds, true);
        break;
      case OverviewActionCommands.REFRESH:
        this.sidePanelService.refresh(...response.objectWorkingIds);
        break;
      case OverviewActionCommands.REMOVE:
        this.sidePanelService.remove(...response.objectWorkingIds);
        break;
      case OverviewActionCommands.DUPLICATE:
        response.objectWorkingIds.forEach(objectWorkingId => {
          this.sidePanelHelper.duplicateObject(
            objectWorkingId,
            response.insertNewWorksheet,
            response.withEdit
          );
        });
        break;
      case OverviewActionCommands.RANGE_TAKEN_OK:
        sidePanelNotificationHelper.importInNewRange(response.objectWorkingId, null, true);
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.RANGE_TAKEN_CLOSE:
        await callback();

        this.store.dispatch(executeNextRepromptTask());
        officeReducerHelper.clearPopupData();
        break;
      case OverviewActionCommands.PAGE_BY_REFRESH_FAILED_CLOSE:
        sidePanelNotificationHelper.clearPopupDataAndRunCallback(callback);
        break;
      case OverviewActionCommands.PAGE_BY_REFRESH_FAILED_EDIT:
        sidePanelNotificationHelper.clearPopupDataAndRunCallback(callback);
        await this.sidePanelService.edit(response.objectWorkingId);
        break;
      case OverviewActionCommands.PAGE_BY_REFRESH_FAILED_REMOVE:
        sidePanelNotificationHelper.clearPopupDataAndRunCallback(callback);
        pageByHelper.handleRemovingMultiplePages(response.objectWorkingId);
        break;
      case OverviewActionCommands.RENAME:
        this.sidePanelService.rename(response.objectWorkingId, response.newName);
        break;
      case OverviewActionCommands.GO_TO_WORKSHEET:
        this.sidePanelService.highlightObject(response.objectWorkingId);
        break;
      case OverviewActionCommands.DISMISS_NOTIFICATION:
        this.handleDismissNotifications(response.objectWorkingIds);
        break;
      case OverviewActionCommands.DISMISS_GLOBAL_NOTIFICATION:
        this.handleDismissGlobalNotification();
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

      const page = pageByData?.elements
        ?.map((element: any) => `${element.name}: ${element.value}`)
        .join(', ');

      return {
        objectWorkingId,
        mstrObjectType,
        name,
        worksheet: worksheet?.name,
        cell: startCell,
        rows: details?.excelTableSize?.rows,
        columns: details?.excelTableSize?.columns,
        objectType: importType,
        lastUpdated: refreshDate,
        status: {
          type: objectNotification?.type,
          title: objectNotification?.title,
          details: objectNotification?.details,
        },
        project: details?.ancestors[0].name,
        owner: details?.owner.name,
        importedBy: details?.importedBy,
        isPrompted,
        ...(pageByData && {
          page,
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
    setDialogPopup({
      type: PopupTypes.DUPLICATE,
      activeCell: officeApiHelper.getCellAddressWithDollars(activeCellAddress),
      onImport: isActiveCellOptionSelected => {
        onDuplicate(objectWorkingIds, !isActiveCellOptionSelected, false);
        setDialogPopup(null);
      },
      onEdit: isActiveCellOptionSelected => {
        onDuplicate(objectWorkingIds, !isActiveCellOptionSelected, true);
        setDialogPopup(null);
      },
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
    notifications?: any[];
    globalNotification?: any;
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
            onClick: () => this.sendDismissNotificationRequest([warning.objectWorkingId]),
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
