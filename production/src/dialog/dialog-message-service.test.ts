/* eslint-disable no-import-assign */
// @ts-expect-error TODO: Fix Types for mstr react library
import { objectTypes } from '@mstr/mstr-react-library';

import { authenticationHelper } from '../authentication/authentication-helper';
import { errorService } from '../error/error-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import { dialogControllerHelper } from './dialog-controller-helper';
import { dialogMessageService } from './dialog-message-service';
import overviewHelper from './overview/overview-helper';

import { reduxStore, RootState } from '../store';

import { PageByDisplayType } from '../page-by/page-by-types';
import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { ObjectData } from '../types/object-types';
import { DialogCommands, DialogResponse } from './dialog-controller-types';
import { OverviewActionCommands } from './overview/overview-types';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import * as operationActions from '../redux-reducer/operation-reducer/operation-actions';
import { ObjectImportType } from '../mstr-object/constants';

import { pageByDataResponse } from '../../__mocks__/page-by-data-response';

describe('Dialog Message Service', () => {
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

  it('should handle ok command from popup for report WITHOUT instance id', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const chosenObjectData = {
      objectId: 'objectId',
      projectId: 'projectId',
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
    };
    const actionObject = {
      command: DialogCommands.COMMAND_OK,
      chosenObject: chosenObjectData.objectId,
      chosenProject: chosenObjectData.projectId,
      chosenSubtype: objectTypes.getTypeValues('Report').subtype,
    };
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleOkCommandSpy = jest
      .spyOn(dialogControllerHelper, 'handleOkCommand')
      .mockImplementation();

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

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
      command: DialogCommands.COMMAND_OK,
      chosenObject: chosenObjectData.objectId,
      chosenProject: chosenObjectData.projectId,
      dossierData: chosenObjectData.dossierData,
      chosenSubtype: objectTypes.getTypeValues('Report').subtype,
    };
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleOkCommandSpy = jest
      .spyOn(dialogControllerHelper, 'handleOkCommand')
      .mockImplementation();

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleOkCommandSpy).toBeCalledTimes(1);
  });

  it('should handle update command from popup for cube', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();
    const objectDialogInfo = {
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      chosenObjectSubtype: objectTypes.getTypeValues('Cube').subtype,
      body: {},
      chosenObjectName: 'testName',
    };

    const actionObject = {
      command: DialogCommands.COMMAND_ON_UPDATE,
      objectsDialogInfo: [objectDialogInfo],
    };
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleUpdateCommandSpy = jest
      .spyOn(dialogControllerHelper, 'handleUpdateCommand')
      .mockImplementation();

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleUpdateCommandSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle update command from popup for report WITHOUT instance id', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();

    const objectDialogInfo = {
      chosenObjectName: 'name',
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      chosenObjectSubtype: objectTypes.getTypeValues('Report').subtype,
      body: {},
    };
    const actionObject = {
      command: DialogCommands.COMMAND_ON_UPDATE,
      objectsDialogInfo: [objectDialogInfo],
    };
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleUpdateCommandSpy = jest
      .spyOn(dialogControllerHelper, 'handleUpdateCommand')
      .mockImplementation();

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleUpdateCommandSpy).toBeCalledTimes(1);
  });

  it('should handle update command from popup for report with dossier data', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();

    const objectDialogInfo = {
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

    const actionObject = {
      command: DialogCommands.COMMAND_ON_UPDATE,
      objectsDialogInfo: [objectDialogInfo],
    };
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const handleUpdateCommandSpy = jest
      .spyOn(dialogControllerHelper, 'handleUpdateCommand')
      .mockImplementation();

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

    // then
    expect(dialog.close).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleUpdateCommandSpy).toBeCalledTimes(1);
  });

  it('should handle cancel command from popup for re-prompt', async () => {
    // given
    officeApiHelper.getExcelSessionStatus = jest.fn();

    const objectDialogInfo = {
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
    const actionObject = {
      command: DialogCommands.COMMAND_CANCEL,
      objectsDialogInfo: [objectDialogInfo],
    };
    const arg = { message: JSON.stringify(actionObject) };
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementationOnce(async () => {});
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const handleUpdateCommandSpy = jest
      .spyOn(dialogControllerHelper, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => false);
    jest
      .spyOn(reduxStore, 'getState')
      .mockReturnValue({ popupStateReducer: { isDataOverviewOpen: false } } as RootState);

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

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
      command: DialogCommands.COMMAND_CANCEL,
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
      .spyOn(dialogControllerHelper, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);
    jest
      .spyOn(reduxStore, 'getState')
      .mockReturnValue({ popupStateReducer: { isDataOverviewOpen: false } } as RootState);
    const resetDialogStatesSpy = jest
      .spyOn(dialogControllerHelper, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

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

    const objectDialogInfo = {
      chosenObjectName: 'name 2',
      chosenObjectId: 'id 2',
      projectId: 'projectId',
    };
    const actionObject = {
      command: DialogCommands.COMMAND_ON_UPDATE,
      objectsDialogInfo: [objectDialogInfo],
    };
    const reportParams = {
      isDuplicate: true,
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
    await dialogMessageService.onMessageFromDialog(dialog, reportParams, arg, () => {});

    // then
    expect(spyValidateAuthToken).toHaveBeenCalled();

    expect(operationActions.duplicateRequested).toBeCalledTimes(1);
    expect(operationActions.duplicateRequested).toBeCalledWith(
      reportParams.object,
      objectDialogInfo
    );
  });

  it('should dispatch duplicateRequested for commandOk - duplication with edit for dossier visualization', async () => {
    // given
    const originalObject = {
      chosenObjectName: 'name 1',
      chosenObject: 'id 1',
      chosenProject: 'projectId',
    };

    const objectDialogInfo = {
      chosenObject: 'id 2',
      chosenObjectName: 'name 2',
      chosenProject: 'projectId',
    };
    const actionObject: DialogResponse = {
      command: DialogCommands.COMMAND_OK,
      objectsDialogInfo: [objectDialogInfo],
    };
    const reportParams = {
      isDuplicate: true,
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
    await dialogMessageService.onMessageFromDialog(dialog, reportParams, arg, () => {});

    // then
    expect(spyValidateAuthToken).toHaveBeenCalled();

    expect(operationActions.duplicateRequested).toBeCalledTimes(1);
    expect(operationActions.duplicateRequested).toBeCalledWith(
      reportParams.object,
      objectDialogInfo
    );
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
    jest.spyOn(dialogControllerHelper, 'getIsMultipleRepromptQueueEmpty').mockReturnValue(true);
    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementation(async () => true);
    jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(async () => {});
    jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementation(() => actionObject.importType as unknown as ObjectData);
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementation(async () => {});

    // when
    await dialogMessageService.onMessageFromDialog(
      dialog,
      null,
      {
        message: JSON.stringify(actionObject),
      },
      () => {}
    );

    // then
    expect(handleOverviewActionCommandMock).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
  });

  it('should dispatch setIsDialogLoaded for commandDialogLoaded', async () => {
    // given
    const actionObject = {
      command: DialogCommands.COMMAND_DIALOG_LOADED,
    };

    const arg = { message: JSON.stringify(actionObject) };

    const mockedStore = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await dialogMessageService.onMessageFromDialog(dialog, null, arg, () => {});

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
    const objectDialogInfo = {
      chosenObject: 'id 2',
      chosenObjectName: 'name 2',
      chosenProject: 'projectId',
    };

    const actionObject = {
      command: DialogCommands.COMMAND_CANCEL,
      objectsDialogInfo: [objectDialogInfo],
    };
    const reportParams = {
      isDuplicate: true,
      object: originalObject,
    };
    const arg = { message: JSON.stringify(actionObject) };

    const handleUpdateCommandSpy = jest
      .spyOn(dialogControllerHelper, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementation(async () => {});
    const manageDialogTypeSpy = jest
      .spyOn(dialogMessageService, 'manageDialogType')
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
    await dialogMessageService.onMessageFromDialog(dialog, reportParams, arg, () => {});

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(manageDialogTypeSpy).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalled();
  });

  it('should dispatch duplicateRequested for commandError - duplication with edit for dossier visualization', async () => {
    // given
    const originalObject = {
      chosenObjectName: 'name 1',
      chosenObject: 'id 1',
      chosenProject: 'projectId',
    };
    const objectDialogInfo = {
      chosenObject: 'id 2',
      chosenObjectName: 'name 2',
      chosenProject: 'projectId',
    };

    const actionObject = {
      command: DialogCommands.COMMAND_ERROR,
      objectsDialogInfo: [objectDialogInfo],
    };
    const reportParams = {
      isDuplicate: true,
      object: originalObject,
    };
    const arg = { message: JSON.stringify(actionObject) };

    const handleUpdateCommandSpy = jest
      .spyOn(dialogControllerHelper, 'getIsMultipleRepromptQueueEmpty')
      .mockImplementation(() => true);
    const spyValidateAuthToken = jest
      .spyOn(authenticationHelper, 'validateAuthToken')
      .mockImplementation(async () => {});
    const handleErrorSpy = jest
      .spyOn(errorService, 'handleError')
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
    await dialogMessageService.onMessageFromDialog(dialog, reportParams, arg, () => {});

    // then
    expect(handleUpdateCommandSpy).toHaveBeenCalled();
    expect(spyValidateAuthToken).toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalled();
    expect(reduxStore.dispatch).toHaveBeenCalled();
  });

  it('should return true for valid overview popup types', () => {
    const validPopupTypes = [
      DialogType.repromptReportDataOverview,
      DialogType.repromptDossierDataOverview,
    ];

    validPopupTypes.forEach(popupType => {
      const result = dialogMessageService.isDataRangeCommandForMultipleRepromptDialogInOverview(
        popupType,
        'overview-range-taken-ok'
      );
      expect(result).toBe(true);
    });
  });

  it('should return false for invalid overview popup types', () => {
    const invalidPopupType = DialogType.dataPreparation;
    const result = dialogMessageService.isDataRangeCommandForMultipleRepromptDialogInOverview(
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
        .spyOn(dialogControllerHelper, 'getObjectPreviousState')
        .mockReturnValue(reportParams);
      const reduxStoreSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
      const handleRemovingMultiplePagesSpy = jest
        .spyOn(pageByHelper, 'handleRemovingMultiplePages')
        .mockImplementation();
      const handleUpdateCommandSpy = jest
        .spyOn(dialogControllerHelper, 'handleUpdateCommand')
        .mockImplementation();

      const response = {
        objectsDialogInfo: [
          {
            objectWorkingId: 1,
            pageByData: pageByDisplayType && { pageByDisplayType },
            pageByConfigurations,
            isPageBy,
          },
        ],
      } as unknown as DialogResponse;

      // when
      await dialogMessageService.onCommandUpdate(response, reportParams);

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
