/* eslint-disable no-import-assign */
// @ts-expect-error TODO: Fix Types for mstr react library
import { objectTypes } from '@mstr/mstr-react-library';

import { authenticationHelper } from '../authentication/authentication-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import overviewHelper, { OverviewActionCommands } from './overview/overview-helper';

import { reduxStore, RootState } from '../store';

import { PageByDisplayType } from '../page-by/page-by-types';
import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { ObjectData } from '../types/object-types';
import { DialogResponse, ReportParams } from './dialog-controller-types';

import { selectorProperties } from '../attribute-selector/selector-properties';
import { errorService } from '../error/error-handler';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import * as operationActions from '../redux-reducer/operation-reducer/operation-actions';
import { dialogController } from './dialog-controller';
import { ObjectImportType } from '../mstr-object/constants';

import { Office } from '../../__mocks__/mockOffice';
import { pageByDataResponse } from '../../__mocks__/page-by-data-response';

describe('Dialog Controller', () => {
  const dialog = {} as unknown as Office.Dialog;

  let duplicateRequestedOriginal: any;
  beforeAll(() => {
    dialog.close = jest.fn();

    duplicateRequestedOriginal = operationActions.duplicateRequested;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    // @ts-expect-error
    operationActions.duplicateRequested = duplicateRequestedOriginal;
  });

  it('should run popup with proper settings when called for navigation', () => {
    // given
    const popupType = DialogType.libraryWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runPopupNavigation();
    // then

    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size);
  });

  it('should call displayDialogAsync on runPopup invocation', async () => {
    // given
    const popupType = DialogType.editFilters;
    jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementationOnce(async () => {});
    jest.spyOn(dialogController, 'onMessageFromPopup').mockImplementationOnce(async () => {});
    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementationOnce(async () => true);
    // when
    await dialogController.runPopup(popupType, 80, 80);
    // then
    expect(Office.context.ui.displayDialogAsync).toHaveBeenCalled();
  });

  it('should run edit popup with proper settings', () => {
    // given
    const reportParams: ReportParams = { bindId: 'bindId' };
    const popupType = DialogType.editFilters;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runEditFiltersPopup(reportParams);

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run edit dossier popup with proper settings', () => {
    // given
    const reportParams: ReportParams = { bindId: 'bindId' };
    const popupType = DialogType.dossierWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runEditDossierPopup(reportParams);

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run reprompt popup with proper settings', () => {
    // given
    const reportParams = 'chosenObjectData';
    const popupType = DialogType.repromptingWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    dialogController.runRepromptPopup(reportParams, false);

    // then
    expect(dispatchSpy).toHaveBeenCalled();
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run repromptDossier popup with proper settings', () => {
    // given
    const reportParams = 'chosenObjectData';
    const popupType = DialogType.dossierWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    dialogController.runRepromptDossierPopup(reportParams);

    // then
    expect(dispatchSpy).toHaveBeenCalled();
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run importedDataOverview popup', () => {
    // given
    const popupType = DialogType.importedDataOverview;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runImportedDataOverviewPopup();

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, null);
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
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleOkCommandSpy = jest.spyOn(dialogController, 'handleOkCommand').mockImplementation();

    // when
    await dialogController.onMessageFromPopup(dialog, null, arg);

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
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleOkCommandSpy = jest.spyOn(dialogController, 'handleOkCommand').mockImplementation();

    // when
    await dialogController.onMessageFromPopup(dialog, null, arg);

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
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleUpdateCommandSpy = jest
      .spyOn(dialogController, 'handleUpdateCommand')
      .mockImplementation();

    // when
    await dialogController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleUpdateCommandSpy).toHaveBeenCalledTimes(1);
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
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleUpdateCommandSpy = jest
      .spyOn(dialogController, 'handleUpdateCommand')
      .mockImplementation();

    // when
    await dialogController.onMessageFromPopup(dialog, null, arg);

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
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleUpdateCommandSpy = jest
      .spyOn(dialogController, 'handleUpdateCommand')
      .mockImplementation();

    // when
    await dialogController.onMessageFromPopup(dialog, null, arg);

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
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const handleUpdateCommandSpy = jest
      .spyOn(dialogController, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => false);
    jest
      .spyOn(reduxStore, 'getState')
      .mockReturnValue({ popupStateReducer: { isDataOverviewOpen: false } } as RootState);

    // when
    await dialogController.onMessageFromPopup(dialog, null, arg);

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
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const handleUpdateCommandSpy = jest
      .spyOn(dialogController, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);
    jest
      .spyOn(reduxStore, 'getState')
      .mockReturnValue({ popupStateReducer: { isDataOverviewOpen: false } } as RootState);
    const resetDialogStatesSpy = jest
      .spyOn(dialogController, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);

    // when
    await dialogController.onMessageFromPopup(dialog, null, arg);

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
      object: originalObject,
    };
    const arg = { message: JSON.stringify(actionObject) };

    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});

    // @ts-expect-error
    operationActions.duplicateRequested = jest.fn().mockReturnValue('duplicateRequestedTest');
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await dialogController.onMessageFromPopup(dialog, reportParams, arg);

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
      object: originalObject,
    };
    const arg = { message: JSON.stringify(actionObject) };

    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});

    // @ts-expect-error
    operationActions.duplicateRequested = jest.fn().mockReturnValue('duplicateRequestedTest');
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await dialogController.onMessageFromPopup(dialog, reportParams, arg);

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
      importType: ObjectImportType.TABLE,
    } as unknown as ObjectData;

    const handleOverviewActionCommandMock = jest
      .spyOn(overviewHelper, 'handleOverviewActionCommand')
      .mockImplementation(async () => {});

    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      popupStateReducer: { popupType: DialogType.importedDataOverview },
    } as RootState);
    jest.spyOn(dialogController, 'getIsMultipleRepromptQueueEmpty').mockReturnValue(true);
    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementation(async () => true);
    jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(async () => {});
    jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementation(() => actionObject.importType as unknown as ObjectData);
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementation(async () => {});

    // when
    await dialogController.onMessageFromPopup(dialog, null, {
      message: JSON.stringify(actionObject),
    });

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
    await dialogController.onMessageFromPopup(dialog, null, arg);

    // then
    expect(mockedStore).toHaveBeenCalledWith({
      isDialogLoaded: true,
      type: 'OFFICE_SET_IS_DIALOG_LOADED',
    });
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
      object: originalObject,
    };
    const arg = { message: JSON.stringify(actionObject) };

    const handleUpdateCommandSpy = jest
      .spyOn(dialogController, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementation(async () => {});
    const manageDialogTypeSpy = jest
      .spyOn(dialogController, 'manageDialogType')
      .mockImplementation(async () => {});
    const runImportedDataOverviewPopupSpy = jest
      .spyOn(dialogController, 'runImportedDataOverviewPopup')
      .mockImplementation(async () => {});

    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementationOnce(async () => true);
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      popupStateReducer: {
        popupType: DialogType.repromptDossierDataOverview,
        isDataOverviewOpen: true,
      },
    } as RootState);

    // when
    await dialogController.onMessageFromPopup(dialog, reportParams, arg);

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(manageDialogTypeSpy).toHaveBeenCalled();
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
      object: originalObject,
    };
    const arg = { message: JSON.stringify(actionObject) };

    const handleUpdateCommandSpy = jest
      .spyOn(dialogController, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementation(async () => {});
    const handleErrorSpy = jest
      .spyOn(errorService, 'handleError')
      .mockImplementation(async () => {});
    const runImportedDataOverviewPopupSpy = jest
      .spyOn(dialogController, 'runImportedDataOverviewPopup')
      .mockImplementation(async () => {});

    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementationOnce(async () => true);
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      popupStateReducer: {
        popupType: DialogType.repromptDossierDataOverview,
        isDataOverviewOpen: true,
      },
    } as RootState);

    // when
    await dialogController.onMessageFromPopup(dialog, reportParams, arg);

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalled();
    expect(runImportedDataOverviewPopupSpy).toHaveBeenCalled();
  });

  it('should return true for valid overview popup types', () => {
    const validPopupTypes = [
      DialogType.repromptReportDataOverview,
      DialogType.repromptDossierDataOverview,
    ];

    validPopupTypes.forEach(popupType => {
      const result = dialogController.isDataRangeCommandForMultipleRepromptDialogInOverview(
        popupType,
        'overview-range-taken-ok'
      );
      expect(result).toBe(true);
    });
  });

  it('should return false for invalid overview popup types', () => {
    const invalidPopupType = DialogType.dataPreparation;
    const result = dialogController.isDataRangeCommandForMultipleRepromptDialogInOverview(
      invalidPopupType,
      'command'
    );

    expect(result).toBe(false);
  });

  it.each`
    pageByDisplayType                 | pageByDisplaySetting              | pageByConfigurations | pageBySiblings                    | reportParams                          | isPageBy | shouldCallReduxStore
    ${PageByDisplayType.DEFAULT_PAGE} | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${[]}                             | ${{ pageByData: pageByDataResponse }} | ${true}  | ${true}
    ${PageByDisplayType.DEFAULT_PAGE} | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${{ pageBySiblings: ['1', '2'] }} | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${PageByDisplayType.DEFAULT_PAGE} | ${PageByDisplayType.ALL_PAGES}    | ${undefined}         | ${[]}                             | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${PageByDisplayType.DEFAULT_PAGE} | ${PageByDisplayType.SELECT_PAGES} | ${['1', '2']}        | ${{ pageBySiblings: ['1', '2'] }} | ${{ pageByData: undefined }}          | ${true}  | ${false}
    ${PageByDisplayType.ALL_PAGES}    | ${PageByDisplayType.ALL_PAGES}    | ${undefined}         | ${{ pageBySiblings: ['1', '2'] }} | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${PageByDisplayType.ALL_PAGES}    | ${PageByDisplayType.ALL_PAGES}    | ${undefined}         | ${[]}                             | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${PageByDisplayType.ALL_PAGES}    | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${{ pageBySiblings: ['1', '2'] }} | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${PageByDisplayType.ALL_PAGES}    | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${[]}                             | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${PageByDisplayType.SELECT_PAGES} | ${PageByDisplayType.SELECT_PAGES} | ${['1', '2']}        | ${{ pageBySiblings: ['1', '2'] }} | ${{ pageByData: undefined }}          | ${true}  | ${false}
    ${PageByDisplayType.SELECT_PAGES} | ${PageByDisplayType.SELECT_PAGES} | ${['1', '2']}        | ${[]}                             | ${{ pageByData: undefined }}          | ${true}  | ${false}
    ${PageByDisplayType.SELECT_PAGES} | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${{ pageBySiblings: ['1', '2'] }} | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${PageByDisplayType.SELECT_PAGES} | ${PageByDisplayType.ALL_PAGES}    | ${undefined}         | ${{ pageBySiblings: ['1', '2'] }} | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${undefined}                      | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${undefined}                      | ${{ something: 'test' }}              | ${false} | ${true}
    ${undefined}                      | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${[]}                             | ${{ pageByData: pageByDataResponse }} | ${true}  | ${false}
    ${undefined}                      | ${PageByDisplayType.DEFAULT_PAGE} | ${undefined}         | ${[]}                             | ${{ something: 'test' }}              | ${true}  | ${false}
  `(
    'onCommandUpdate should trigger proper function when called with $pageByDisplayType and $pageByDisplaySetting',
    async ({
      pageByDisplayType,
      pageByDisplaySetting,
      pageByConfigurations,
      pageBySiblings,
      reportParams,
      isPageBy,
      shouldCallReduxStore,
    }) => {
      // given
      jest.spyOn(reduxStore, 'getState').mockImplementation(
        () =>
          ({
            settingsReducer: { pageByDisplaySetting },
          }) as RootState
      );

      jest.spyOn(pageByHelper, 'getAllPageByObjects').mockReturnValue(pageBySiblings);

      const getObjectPreviousStateSpy = jest
        .spyOn(dialogController, 'getObjectPreviousState')
        .mockReturnValue(reportParams);
      const reduxStoreSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
      const handleRemovingMultiplePagesSpy = jest
        .spyOn(pageByHelper, 'handleRemovingMultiplePages')
        .mockImplementation();
      const handleUpdateCommandSpy = jest
        .spyOn(dialogController, 'handleUpdateCommand')
        .mockImplementation();

      const response = {
        objectWorkingId: 1,
        pageByData: pageByDisplayType && { pageByDisplayType },
        pageByConfigurations,
        isPageBy,
      } as DialogResponse;

      // when
      await dialogController.onCommandUpdate(response, reportParams);

      // then
      if (shouldCallReduxStore) {
        expect(getObjectPreviousStateSpy).toHaveBeenCalled();
        expect(reduxStoreSpy).toHaveBeenCalled();
      } else {
        expect(handleRemovingMultiplePagesSpy).toHaveBeenCalled();
        expect(handleUpdateCommandSpy).toHaveBeenCalled();
      }
    }
  );
});
