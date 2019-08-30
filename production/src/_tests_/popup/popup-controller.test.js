import { objectTypes } from '@mstr/mstr-react-library';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { popupController } from '../../popup/popup-controller';
import { officeDisplayService } from '../../office/office-display-service';
import { errorService } from '../../error/error-handler';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { officeApiHelper } from '../../office/office-api-helper';
import { notificationService } from '../../notification/notification-service';

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
    const runPopupSpy = jest.spyOn(popupController, 'runPopup').mockImplementationOnce(() => { });
    // when
    popupController.runPopupNavigation();
    // then
    expect(runPopupSpy).toBeCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size);
  });

  it('should run edit popup with proper settings', () => {
    // given
    const reportParams = 'reportData';
    const popupType = PopupTypeEnum.editFilters;
    const size = 80;
    const runPopupSpy = jest.spyOn(popupController, 'runPopup').mockImplementationOnce(() => { });
    // when
    popupController.runEditFiltersPopup(reportParams);
    // then
    expect(runPopupSpy).toBeCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should handle ok command from popup for report WITHOUT instance id',
    async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      popupController._getReportsPreviousState = jest.fn();
      const reportData = {
        objectId: 'objectId',
        projectId: 'projectId',
        isReport: true,
      };
      const actionObject = {
        command: selectorProperties.commandOk,
        chosenObject: reportData.objectId,
        chosenProject: reportData.projectId,
        chosenSubtype: objectTypes.getTypeValues('Report').subtype,
      };
      const arg = {
        message: JSON.stringify(actionObject),
      };
      officeApiHelper.getOfficeSessionStatus = jest.fn();
      const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
      const expectedOptions = {
        objectId: reportData.objectId,
        projectId: reportData.projectId,
        bindingId: null,
        isRefresh: false,
        isReport: true,
      };
      // when
      await popupController.onMessageFromPopup(dialog, null, arg);
      // then
      expect(dialog.close).toBeCalled();
      expect(mockPrint).toBeCalled();
      expect(mockPrint).toBeCalledWith(expectedOptions);
    });

  it('should handle ok command from popup for report with dossier data',
    async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      const reportData = {
        objectId: 'objectId',
        projectId: 'projectId',
        isReport: true,
        dossierData: {
          instanceId: 'instanceId',
          whatever: 'whatever',
        },
      };
      const actionObject = {
        command: selectorProperties.commandOk,
        chosenObject: reportData.objectId,
        chosenProject: reportData.projectId,
        dossierData: reportData.dossierData,
        chosenSubtype: objectTypes.getTypeValues('Report').subtype,
      };
      const arg = {
        message: JSON.stringify(actionObject),
      };
      officeApiHelper.getOfficeSessionStatus = jest.fn();
      const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
      const expectedOptions = {
        bindingId: null,
        dossierData: reportData.dossierData,
        objectId: reportData.objectId,
        projectId: reportData.projectId,
        isReport: reportData.isReport,
        isRefresh: false,
      };
      // when
      await popupController.onMessageFromPopup(dialog, null, arg);
      // then
      expect(dialog.close).toBeCalled();
      expect(mockPrint).toBeCalled();
      expect(mockPrint).toBeCalledWith(expectedOptions);
    });

  it('should handle update command from popup for cube',
    async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      const actionObject = {
        command: selectorProperties.commandOnUpdate,
        reportId: 'reportId',
        projectId: 'projectId',
        reportSubtype: objectTypes.getTypeValues('Cube').subtype,
        body: {},
        reportName: 'testName',
      };
      const arg = {
        message: JSON.stringify(actionObject),
      };
      officeApiHelper.getOfficeSessionStatus = jest.fn();
      const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
      const expectedOptions = {
        dossierData: undefined,
        objectId: actionObject.reportId,
        projectId: actionObject.projectId,
        isReport: false,
        body: actionObject.body,
      };
      // when
      await popupController.onMessageFromPopup(dialog, null, arg);
      // then
      expect(dialog.close).toBeCalled();
      expect(mockPrint).toBeCalled();
      expect(mockPrint).toBeCalledWith(expectedOptions);
    });

  it('should handle update command from popup for report WITHOUT instance id',
    async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      const actionObject = {
        reportName: 'name',
        command: selectorProperties.commandOnUpdate,
        reportId: 'reportId',
        projectId: 'projectId',
        reportSubtype: objectTypes.getTypeValues('Report').subtype,
        body: {},
      };
      const arg = {
        message: JSON.stringify(actionObject),
      };
      officeApiHelper.getOfficeSessionStatus = jest.fn();
      const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
      // when
      await popupController.onMessageFromPopup(dialog, null, arg);
      // then
      expect(dialog.close).toBeCalled();
      expect(mockPrint).toBeCalled();

      const expectedOptions = {
        dossierData: undefined,
        isReport: true,
        objectId: actionObject.reportId,
        projectId: actionObject.projectId,
        body: actionObject.body,
      };

      expect(mockPrint).toBeCalledWith(expectedOptions);
    });

  it('should handle update command from popup for report with dossier data',
    async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      const actionObject = {
        command: selectorProperties.commandOnUpdate,
        reportId: 'reportId',
        projectId: 'projectId',
        dossierData: {
          instanceId: 'instanceId',
          whatever: 'whatever',
        },
        reportSubtype: objectTypes.getTypeValues('Report').subtype,
        body: {},
        reportName: 'testName',
      };
      const arg = {
        message: JSON.stringify(actionObject),
      };
      officeApiHelper.getOfficeSessionStatus = jest.fn();
      const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
      // when
      await popupController.onMessageFromPopup(dialog, null, arg);
      // then
      expect(dialog.close).toBeCalled();
      expect(mockPrint).toBeCalled();
      expect(mockPrint).toBeCalledWith({
        dossierData: actionObject.dossierData,
        objectId: actionObject.reportId,
        projectId: actionObject.projectId,
        isReport: true,
        body: actionObject.body,
      });
    });

  it('should handle error command from popup', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const command = selectorProperties.commandError;
    const error = {
      response: {
        status: 404,
      },
    };
    const expectedMessage = JSON.stringify({ command, error });
    const givenArg = {
      message: expectedMessage,
    };
    officeApiHelper.getOfficeSessionStatus = jest.fn();
    const handleErrorSpy = jest.spyOn(errorService, 'handleError');
    const notifySpy = jest.spyOn(notificationService, 'displayNotification');
    // when
    await popupController.onMessageFromPopup(dialog, null, givenArg);
    // then
    expect(handleErrorSpy).toBeCalledWith(error);
    expect(notifySpy).toBeCalledWith({
      type: 'warning', content: 'The endpoint cannot be reached', details: '', onConfirm: null,
    });
    expect(dialog.close).toBeCalled();
  });
});
