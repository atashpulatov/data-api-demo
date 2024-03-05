import { objectTypes } from '@mstr/mstr-react-library';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { popupController } from '../../popup/popup-controller';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { officeApiHelper } from '../../office/api/office-api-helper';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { authenticationHelper } from '../../authentication/authentication-helper';
import * as operationActions from '../../redux-reducer/operation-reducer/operation-actions';
import { reduxStore } from '../../store';
import { Office } from '../mockOffice';
import overviewHelper, { OverviewActionCommands } from '../../popup/overview/overview-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { errorService } from '../../error/error-handler';

describe('PopupController', () => {
  const dialog = {};

  let duplicateRequestedOriginal;
  beforeAll(() => {
    dialog.close = jest.fn();

    duplicateRequestedOriginal = operationActions.duplicateRequested;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    operationActions.duplicateRequested = duplicateRequestedOriginal;
  });

  it('should run popup with proper settings when called for navigation', () => {
    // given
    const popupType = PopupTypeEnum.libraryWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(popupController, 'runPopup')
      .mockImplementationOnce(() => { });

    // when
    popupController.runPopupNavigation();
    // then

    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size);
  });

  it('should call displayDialogAsync on runPopup invocation', async () => {
    // given
    const popupType = PopupTypeEnum.editFilters;
    jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementationOnce(() => { });
    jest.spyOn(popupController, 'onMessageFromPopup').mockImplementationOnce(() => { });
    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementationOnce(() => { });
    // when
    await popupController.runPopup(popupType, 80, 80);
    // then
    expect(Office.context.ui.displayDialogAsync).toHaveBeenCalled();
  });

  it('should run edit popup with proper settings', () => {
    // given
    const reportParams = 'chosenObjectData';
    const popupType = PopupTypeEnum.editFilters;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(popupController, 'runPopup')
      .mockImplementationOnce(() => { });

    // when
    popupController.runEditFiltersPopup(reportParams);

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run edit dossier popup with proper settings', () => {
    // given
    const reportParams = 'chosenObjectData';
    const popupType = PopupTypeEnum.dossierWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(popupController, 'runPopup')
      .mockImplementationOnce(() => { });

    // when
    popupController.runEditDossierPopup(reportParams);

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run reprompt popup with proper settings', () => {
    // given
    const reportParams = 'chosenObjectData';
    const popupType = PopupTypeEnum.repromptingWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(popupController, 'runPopup')
      .mockImplementationOnce(() => { });

    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    popupController.runRepromptPopup(reportParams, false);

    // then
    expect(dispatchSpy).toHaveBeenCalled();
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run repromptDossier popup with proper settings', () => {
    // given
    const reportParams = 'chosenObjectData';
    const popupType = PopupTypeEnum.dossierWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(popupController, 'runPopup')
      .mockImplementationOnce(() => { });

    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    popupController.runRepromptDossierPopup(reportParams);

    // then
    expect(dispatchSpy).toHaveBeenCalled();
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run importedDataOverview popup', () => {
    // given
    const popupType = PopupTypeEnum.importedDataOverview;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(popupController, 'runPopup')
      .mockImplementationOnce(() => { });

    // when
    popupController.runImportedDataOverviewPopup();

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, null, true);
  });

  it('should handle ok command from popup for report WITHOUT instance id', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const chosenObjectData = {
      objectId: 'objectId',
      projectId: 'projectId',
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
    };
    const actionObject = {
      command: selectorProperties.commandOk,
      chosenObject: chosenObjectData.objectId,
      chosenProject: chosenObjectData.projectId,
      chosenSubtype: objectTypes.getTypeValues('Report').subtype,
    };
    const arg = { message: JSON.stringify(actionObject), };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    const handleOkCommandSpy = jest.spyOn(popupController, 'handleOkCommand').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleOkCommandSpy).toBeCalledTimes(1);
  });

  it('should handle ok command from popup for report with dossier data', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const chosenObjectData = {
      objectId: 'objectId',
      projectId: 'projectId',
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
    };
    const actionObject = {
      command: selectorProperties.commandOk,
      chosenObject: chosenObjectData.objectId,
      chosenProject: chosenObjectData.projectId,
      dossierData: chosenObjectData.dossierData,
      chosenSubtype: objectTypes.getTypeValues('Report').subtype,
    };
    const arg = { message: JSON.stringify(actionObject), };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    const handleOkCommandSpy = jest.spyOn(popupController, 'handleOkCommand').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleOkCommandSpy).toBeCalledTimes(1);
  });

  it('should handle update command from popup for cube', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const actionObject = {
      command: selectorProperties.commandOnUpdate,
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      chosenObjectSubtype: objectTypes.getTypeValues('Cube').subtype,
      body: {},
      chosenObjectName: 'testName',
    };
    const arg = { message: JSON.stringify(actionObject), };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    const handleUpdateCommandSpy = jest.spyOn(popupController, 'handleUpdateCommand').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleUpdateCommandSpy).toBeCalledTimes(1);
  });

  it('should handle update command from popup for report WITHOUT instance id', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const actionObject = {
      chosenObjectName: 'name',
      command: selectorProperties.commandOnUpdate,
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      chosenObjectSubtype: objectTypes.getTypeValues('Report').subtype,
      body: {},
    };
    const arg = { message: JSON.stringify(actionObject), };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    const handleUpdateCommandSpy = jest.spyOn(popupController, 'handleUpdateCommand').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleUpdateCommandSpy).toBeCalledTimes(1);
  });

  it('should handle update command from popup for report with dossier data', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const actionObject = {
      command: selectorProperties.commandOnUpdate,
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
      chosenObjectSubtype: objectTypes.getTypeValues('Report').subtype,
      body: {},
      chosenObjectName: 'testName',
    };
    const arg = { message: JSON.stringify(actionObject), };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    const handleUpdateCommandSpy = jest.spyOn(popupController, 'handleUpdateCommand').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleUpdateCommandSpy).toBeCalledTimes(1);
  });

  it('should handle cancel command from popup for re-prompt', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const actionObject = {
      command: selectorProperties.commandCancel,
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
      chosenObjectSubtype: objectTypes.getTypeValues('Report').subtype,
      body: {},
      chosenObjectName: 'testName',
    };
    const arg = { message: JSON.stringify(actionObject), };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const handleUpdateCommandSpy = jest.spyOn(popupController, 'getIsMultipleRepromptQueueEmpty').mockImplementation(() => false);
    jest.spyOn(reduxStore, 'getState').mockReturnValue({ popupStateReducer: { isDataOverviewOpen: false } });

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should handle cancel command from popup for re-prompt and call overview popup', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const actionObject = {
      command: selectorProperties.commandCancel,
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
      chosenObjectSubtype: objectTypes.getTypeValues('Report').subtype,
      body: {},
      chosenObjectName: 'testName',
    };
    const arg = { message: JSON.stringify(actionObject), };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const handleUpdateCommandSpy = jest.spyOn(popupController, 'getIsMultipleRepromptQueueEmpty').mockImplementation(() => true);
    jest.spyOn(reduxStore, 'getState').mockReturnValue({ popupStateReducer: { isDataOverviewOpen: false } });
    const resetDialogStatesSpy = jest.spyOn(popupController, 'getIsMultipleRepromptQueueEmpty').mockImplementation(() => true);

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
    expect(resetDialogStatesSpy).toHaveBeenCalled();
  });

  it('should dispatch duplicateRequested for commandOnUpdate - duplication with edit for report', async () => {
    // given
    const originalObject = {
      chosenObjectName: 'name 1',
      chosenObjectId: 'id 1',
      projectId: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandOnUpdate,
      chosenObjectName: 'name 2',
      chosenObjectId: 'id 2',
      projectId: 'projectId',
    };
    const reportParams = {
      duplicateMode: true,
      object: originalObject
    };
    const arg = { message: JSON.stringify(actionObject), };

    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });

    operationActions.duplicateRequested = jest.fn().mockReturnValue('duplicateRequestedTest');
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, reportParams, arg);

    // then
    expect(spyValidateAuthToken).toHaveBeenCalled();

    expect(operationActions.duplicateRequested).toBeCalledTimes(1);
    expect(operationActions.duplicateRequested).toBeCalledWith(reportParams.object, actionObject);
  });

  it('should dispatch duplicateRequested for commandOk - duplication with edit for dossier visualization', async () => {
    // given
    const originalObject = {
      chosenObjectName: 'name 1',
      chosenObject: 'id 1',
      chosenProject: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandOk,
      chosenObject: 'id 2',
      chosenObjectName: 'name 2',
      chosenProject: 'projectId',
    };
    const reportParams = {
      duplicateMode: true,
      object: originalObject
    };
    const arg = { message: JSON.stringify(actionObject), };

    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });

    operationActions.duplicateRequested = jest.fn().mockReturnValue('duplicateRequestedTest');
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, reportParams, arg);

    // then
    expect(spyValidateAuthToken).toHaveBeenCalled();

    expect(operationActions.duplicateRequested).toBeCalledTimes(1);
    expect(operationActions.duplicateRequested).toBeCalledWith(reportParams.object, actionObject);
  });

  it.each`
  actionCommand
  ${OverviewActionCommands.REFRESH}     
  ${OverviewActionCommands.REMOVE}     
  ${OverviewActionCommands.DUPLICATE}
  ${OverviewActionCommands.DISMISS_NOTIFICATION}     
  `('should call handleOverviewActionCommand for overview actions', async ({ actionCommand }) => {
    // given
    const actionObject = {
      command: actionCommand,
      objectWorkingIds: [1],
      importType: 'table'
    };

    const handleOverviewActionCommandMock = jest.spyOn(overviewHelper, 'handleOverviewActionCommand').mockImplementation(() => { });

    jest.spyOn(reduxStore, 'getState').mockReturnValue({ popupStateReducer: { popupType: PopupTypeEnum.importedDataOverview } });
    jest.spyOn(popupController, 'getIsMultipleRepromptQueueEmpty').mockReturnValue(true);
    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementation(() => { });
    jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(() => { });
    jest.spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId').mockImplementation(() => actionObject.importType);
    const spyValidateAuthToken = jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(() => { });

    // when
    await popupController.onMessageFromPopup(dialog, null, { message: JSON.stringify(actionObject) });

    // then
    expect(handleOverviewActionCommandMock).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
  });

  it('should dispatch setIsDialogLoaded for commandDialogLoaded', async () => {
    // given
    const actionObject = {
      command: selectorProperties.commandDialogLoaded,
    };

    const arg = { message: JSON.stringify(actionObject) };

    const mockedStore = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await popupController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(mockedStore).toHaveBeenCalledWith({ isDialogLoaded: true, type: 'OFFICE_SET_IS_DIALOG_LOADED' });
  });

  it('should dispatch duplicateRequested for commandCancel - duplication with edit for dossier visualization', async () => {
    // given
    const originalObject = {
      chosenObjectName: 'name 1',
      chosenObject: 'id 1',
      chosenProject: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandCancel,
      chosenObject: 'id 2',
      chosenObjectName: 'name 2',
      chosenProject: 'projectId',
    };
    const reportParams = {
      duplicateMode: true,
      object: originalObject
    };
    const arg = { message: JSON.stringify(actionObject), };

    const handleUpdateCommandSpy = jest.spyOn(popupController, 'getIsMultipleRepromptQueueEmpty').mockImplementation(() => true);
    const spyValidateAuthToken = jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(() => { });
    const processCancelCommandSpy = jest.spyOn(popupController, 'processCancelCommand').mockImplementation(() => { });
    const runImportedDataOverviewPopupSpy = jest.spyOn(popupController, 'runImportedDataOverviewPopup').mockImplementation(() => { });

    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementationOnce(() => { });
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      popupStateReducer: {
        popupType: PopupTypeEnum.repromptDossierDataOverview,
        isDataOverviewOpen: true,
      }
    });

    // when
    await popupController.onMessageFromPopup(dialog, reportParams, arg);

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(processCancelCommandSpy).toHaveBeenCalled();
    expect(runImportedDataOverviewPopupSpy).toHaveBeenCalled();
  });

  it('should dispatch duplicateRequested for commandError - duplication with edit for dossier visualization', async () => {
    // given
    const originalObject = {
      chosenObjectName: 'name 1',
      chosenObject: 'id 1',
      chosenProject: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandError,
      chosenObject: 'id 2',
      chosenObjectName: 'name 2',
      chosenProject: 'projectId',
    };
    const reportParams = {
      duplicateMode: true,
      object: originalObject
    };
    const arg = { message: JSON.stringify(actionObject), };

    const handleUpdateCommandSpy = jest.spyOn(popupController, 'getIsMultipleRepromptQueueEmpty').mockImplementation(() => true);
    const spyValidateAuthToken = jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(() => { });
    const handleErrorSpy = jest.spyOn(errorService, 'handleError').mockImplementation(() => { });
    const runImportedDataOverviewPopupSpy = jest.spyOn(popupController, 'runImportedDataOverviewPopup').mockImplementation(() => { });

    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementationOnce(() => { });
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      popupStateReducer: {
        popupType: PopupTypeEnum.repromptDossierDataOverview,
        isDataOverviewOpen: true,
      }
    });

    // when
    await popupController.onMessageFromPopup(dialog, reportParams, arg);

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalled();
    expect(runImportedDataOverviewPopupSpy).toHaveBeenCalled();
  });
});
