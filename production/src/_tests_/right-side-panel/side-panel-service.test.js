import { userRestService } from '../../home/user-rest-service';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { sidePanelService } from '../../right-side-panel/side-panel-service';

import officeStoreObject from '../../office/store/office-store-object';
import { reduxStore } from '../../store';

import { popupController } from '../../popup/popup-controller';
import * as operationActions from '../../redux-reducer/operation-reducer/operation-actions';
import { popupActions } from '../../redux-reducer/popup-reducer/popup-actions';

describe('SidePanelService', () => {
  jest.useFakeTimers();

  let duplicateRequestedOriginal;
  let callForDuplicateOriginal;
  beforeAll(() => {
    duplicateRequestedOriginal = operationActions.duplicateRequested;
    operationActions.duplicateRequested = jest
      .fn()
      .mockReturnValue('duplicateRequestedTest');

    callForDuplicateOriginal = popupActions.duplicateRequested;
    popupActions.callForDuplicate = jest
      .fn()
      .mockReturnValue('callForDuplicateTest');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    operationActions.duplicateRequested = duplicateRequestedOriginal;
    popupActions.callForDuplicate = callForDuplicateOriginal;
  });

  it('should open popup', () => {
    // given
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    const mockedRunPopup = jest
      .spyOn(popupController, 'runPopupNavigation')
      .mockImplementation();
    // when
    sidePanelService.clearRepromptTask();
    sidePanelService.addData({ });
    // then
    expect(mockedDispatch).toBeCalledTimes(2);
    expect(mockedRunPopup).toBeCalledTimes(1);
  });

  it('should highlight an object', () => {
    // given
    const objectWorkingId = 12345;
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();

    // when
    sidePanelService.highlightObject(objectWorkingId);
    // then
    expect(mockedDispatch).toBeCalledTimes(1);
  });

  it('should rename an object', () => {
    // given
    const objectWorkingId = 12345;
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    const mockedSaveObjects = jest
      .spyOn(officeStoreObject, 'saveObjectsInExcelStore')
      .mockImplementation();

    // when
    sidePanelService.rename(objectWorkingId);
    // then
    expect(mockedDispatch).toBeCalledTimes(1);
    expect(mockedSaveObjects).toBeCalledTimes(1);
  });

  it('should refresh objects', () => {
    // given
    const objectWorkingIds = [1, 2, 3, 4, 5];
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    // when
    sidePanelService.refresh(objectWorkingIds);
    // then
    expect(mockedDispatch).toBeCalledTimes(objectWorkingIds.length);
  });

  it('should remove objects', () => {
    // given
    const objectWorkingIds = [12, 34, 56];
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    // when
    sidePanelService.remove(objectWorkingIds);
    // then
    expect(mockedDispatch).toBeCalledTimes(objectWorkingIds.length);
  });

  it('should dispatch duplicateRequested for duplicate with import', () => {
    // given
    const objectWorkingId = 12345;
    const insertNewWorksheet = true;
    const withEdit = false;
    const mockObject = {
      data: 'data',
      bindId: 'test',
      tableName: 'name',
      refreshDate: 'date',
      preparedInstanceId: 'instance id',
      subtotalsInfo: { subtotalsAddresses: [] },
    };
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    const expectedObject = {
      data: 'data',
      insertNewWorksheet,
      objectWorkingId: 789,
      subtotalsInfo: {},
    };

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    Date.now = jest.fn().mockImplementationOnce(() => 789);
    // when
    sidePanelService.duplicate(objectWorkingId, insertNewWorksheet, withEdit);
    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalledWith(
      objectWorkingId
    );
    expect(operationActions.duplicateRequested).toBeCalledTimes(1);
    expect(operationActions.duplicateRequested).toBeCalledWith(expectedObject);
  });

  it('should dispatch popupActions.callForDuplicate for duplicate with edit', () => {
    // given
    const objectWorkingId = 12345;
    const insertNewWorksheet = false;
    const withEdit = true;
    const mockObject = {
      data: 'data',
      bindId: 'test',
      tableName: 'name',
      refreshDate: 'date',
      preparedInstanceId: 'instance id',
      subtotalsInfo: { subtotalsAddresses: [] },
    };

    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    const expectedObject = {
      data: 'data',
      insertNewWorksheet,
      objectWorkingId: 789,
      subtotalsInfo: {},
    };

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    Date.now = jest.fn().mockImplementationOnce(() => 789);
    // when
    sidePanelService.duplicate(objectWorkingId, insertNewWorksheet, withEdit);
    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalledWith(
      objectWorkingId
    );
    expect(popupActions.callForDuplicate).toBeCalledTimes(1);
    expect(popupActions.callForDuplicate).toBeCalledWith(expectedObject);
  });

  it.each`
    objectType
    ${'report'}
    ${'dataset'}
    ${'visualization'}
  `('should edit an object', async ({ objectType }) => {
    // given
    const objectWorkingId = 1;
    const mockObject = {
      bindId: 1,
      mstrObjectType: { name: objectType },
    };

    const mockedGetExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation();
    const mockedisSheetProtected = jest
      .spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected')
      .mockImplementation();
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    // when
    await sidePanelService.edit(objectWorkingId);

    // then
    expect(mockedGetExcelContext).toBeCalled();
    expect(mockedisSheetProtected).toBeCalled();
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalled();
    expect(mockedDispatch).toBeCalled();
  });

  it.each`
    objectType
    ${'report'}
    ${'visualization'}
  `('createRepromptTask should return an object containing a callback, which when called, will properly call officeApi helpers and dispatch an action', async ({ objectType }) => {
    // given
    const objectWorkingId = 1;
    const mockObject = {
      bindId: 1,
      mstrObjectType: { name: objectType },
    };

    const mockedGetExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation();
    const mockedisSheetProtected = jest
      .spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected')
      .mockImplementation();
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();

    // when
    const { isPrompted, callback } = sidePanelService.createRepromptTask(
      mockObject.bindId,
      mockObject.mstrObjectType,
      true
    );
    await callback();

    // then
    expect(isPrompted).toBeTruthy();
    expect(mockedGetExcelContext).toBeCalled();
    expect(mockedisSheetProtected).toBeCalled();
    expect(mockedDispatch).toBeCalled();
  });

  it.each`
    objectType
    ${'report'}
    ${'dataset'}
    ${'visualization'}
  `('should reprompt an object', async ({ objectType }) => {
    // given
    const objectWorkingId = 1;
    const mockObject = {
      bindId: 1,
      mstrObjectType: { name: objectType },
      isPrompted: true,
    };

    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);
    const clearRepromptTaskMockup = jest.spyOn(sidePanelService, 'clearRepromptTask').mockImplementation();

    // when
    await sidePanelService.reprompt([objectWorkingId]);

    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalled();
    expect(mockedDispatch).toBeCalled();
    expect(clearRepromptTaskMockup).toBeCalled();
  });

  it('should refresh an object', async () => {
    // given
    const objectWorkingIds = [1, 1];
    const mockObject = {
      bindId: 1,
      mstrObjectType: { name: 'report' },
      isPrompted: false,
    };

    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementation(() => mockObject);
    const clearRepromptTaskMockup = jest.spyOn(sidePanelService, 'clearRepromptTask').mockImplementation();

    // when
    await sidePanelService.reprompt(objectWorkingIds);

    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalled();
    expect(mockedDispatch).toBeCalled();
    expect(clearRepromptTaskMockup).toBeCalled();
  });

  it('should dispatch officeActions.toggleReusePromptAnswersFlag to initialize the reuse prompt answers flag', async () => {
    // given
    const mockObject = {
      value: 0,
    };
    const mockedGetUserPreference = jest
      .spyOn(userRestService, 'getUserPreference')
      .mockImplementationOnce(() => mockObject);
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    // when
    await sidePanelService.initReusePromptAnswers();
    // then
    expect(mockedGetUserPreference).toBeCalled();
    expect(mockedDispatch).toBeCalled();
  });

  it('should dispatch officeActions.toggleReusePromptAnswersFlag to update the reuse prompt answers flag', async () => {
    // given
    const mockObject = {
      value: 0,
    };
    const mockedSetUserPreference = jest
      .spyOn(userRestService, 'setUserPreference')
      .mockImplementationOnce(() => mockObject);

    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    // when
    await sidePanelService.toggleReusePromptAnswers(0);
    // then
    expect(mockedSetUserPreference).toBeCalled();
    expect(mockedDispatch).toBeCalled();
  });

  it('should dispatch officeActions.toggleSettingsPanelLoadedFlag to update the settings panel loaded flag', async () => {
    // given
    const mockedDispatch = jest
      .spyOn(reduxStore, 'dispatch')
      .mockImplementation();
    // when
    sidePanelService.toggleSettingsPanel(true);
    // then
    expect(mockedDispatch).toBeCalled();
  });
});
