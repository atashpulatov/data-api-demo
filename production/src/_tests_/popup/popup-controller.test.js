import { objectTypes } from '@mstr/mstr-react-library';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { popupController } from '../../popup/popup-controller';
import { officeDisplayService } from '../../office/office-display-service';
import { errorService } from '../../error/error-handler';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { notificationService } from '../../notification/notification-service';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { authenticationHelper } from '../../authentication/authentication-helper';

describe('PopupController', () => {
  const dialog = {};

  beforeAll(() => {
    dialog.close = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should run popup with proper settings when called for navigation', () => {
    // given
    const popupType = PopupTypeEnum.navigationTree;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(popupController, 'runPopup')
      .mockImplementationOnce(() => { });
    // when
    popupController.runPopupNavigation();
    // then
    expect(runPopupSpy).toBeCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size);
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
    expect(runPopupSpy).toBeCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should handle ok command from popup for report WITHOUT instance id', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    popupController._getReportsPreviousState = jest.fn();
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
    const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
    const expectedOptions = {
      objectId: chosenObjectData.objectId,
      projectId: chosenObjectData.projectId,
      bindingId: null,
      isRefresh: false,
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
    };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    // when
    await popupController.onMessageFromPopup(dialog, null, arg);
    // then
    expect(dialog.close).toBeCalled();
    expect(spyValidateAuthToken).toBeCalled();
    expect(mockPrint).toBeCalled();
    expect(mockPrint).toBeCalledWith(expectedOptions);
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
    const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
    const expectedOptions = {
      bindingId: null,
      dossierData: chosenObjectData.dossierData,
      objectId: chosenObjectData.objectId,
      projectId: chosenObjectData.projectId,
      mstrObjectType: chosenObjectData.mstrObjectType,
      isRefresh: false,
    };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    // when
    await popupController.onMessageFromPopup(dialog, null, arg);
    // then
    expect(dialog.close).toBeCalled();
    expect(spyValidateAuthToken).toBeCalled();
    expect(mockPrint).toBeCalled();
    expect(mockPrint).toBeCalledWith(expectedOptions);
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
    const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
    const expectedOptions = {
      dossierData: undefined,
      objectId: actionObject.chosenObjectId,
      projectId: actionObject.projectId,
      mstrObjectType: mstrObjectEnum.mstrObjectType.dataset,
      body: actionObject.body,
    };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    // when
    await popupController.onMessageFromPopup(dialog, null, arg);
    // then
    expect(dialog.close).toBeCalled();
    expect(spyValidateAuthToken).toBeCalled();
    expect(mockPrint).toBeCalled();
    expect(mockPrint).toBeCalledWith(expectedOptions);
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
    const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    // when
    await popupController.onMessageFromPopup(dialog, null, arg);
    // then
    expect(dialog.close).toBeCalled();
    expect(spyValidateAuthToken).toBeCalled();
    expect(mockPrint).toBeCalled();

    const expectedOptions = {
      dossierData: undefined,
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
      objectId: actionObject.chosenObjectId,
      projectId: actionObject.projectId,
      body: actionObject.body,
    };

    expect(mockPrint).toBeCalledWith(expectedOptions);
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
    const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    // when
    await popupController.onMessageFromPopup(dialog, null, arg);
    // then
    expect(dialog.close).toBeCalled();
    expect(spyValidateAuthToken).toBeCalled();
    expect(mockPrint).toBeCalled();
    expect(mockPrint).toBeCalledWith({
      dossierData: actionObject.dossierData,
      objectId: actionObject.chosenObjectId,
      projectId: actionObject.projectId,
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
      body: actionObject.body,
    });
  });

  it('should handle error command from popup', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const command = selectorProperties.commandError;
    const error = { response: { status: 404, }, };
    const expectedMessage = JSON.stringify({ command, error });
    const givenArg = { message: expectedMessage, };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const handleErrorSpy = jest.spyOn(errorService, 'handleError');
    const notifySpy = jest.spyOn(notificationService, 'displayNotification');
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(() => { });
    // when
    await popupController.onMessageFromPopup(dialog, null, givenArg);
    // then
    expect(handleErrorSpy).toBeCalledWith(error);
    expect(spyValidateAuthToken).toBeCalled();
    expect(notifySpy).toBeCalledWith({
      type: 'warning', content: 'The endpoint cannot be reached', details: '', onConfirm: null,
    });
    expect(dialog.close).toBeCalled();
  });
});
