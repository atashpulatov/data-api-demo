import { authenticationHelper } from '../../authentication/authentication-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import officeStoreHelper from '../../office/store/office-store-helper';
import { sidePanelHelper } from './side-panel-helper';
import { SidePanelService, sidePanelService } from './side-panel-service';

import officeStoreObject from '../../office/store/office-store-object';
import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { dialogController } from '../../dialog/dialog-controller';
import * as toggleFlag from '../../redux-reducer/office-reducer/office-actions';

describe('SidePanelService', () => {
  jest.useFakeTimers();

  authenticationHelper.checkStatusOfSessions = jest.fn();
  officeReducerHelper.noOperationInProgress = jest.fn().mockReturnValue(true);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should open popup', async () => {
    // given
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const mockedRunPopup = jest.spyOn(dialogController, 'runPopupNavigation').mockImplementation();
    // when
    sidePanelHelper.clearRepromptTask();
    await sidePanelService.addData();
    // then
    expect(mockedDispatch).toHaveBeenCalledTimes(2);
    expect(mockedRunPopup).toHaveBeenCalledTimes(1);
  });

  it('should highlight an object', async () => {
    // given
    const objectWorkingId = 12345;
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await sidePanelService.highlightObject(objectWorkingId);
    // then
    expect(mockedDispatch).toHaveBeenCalledTimes(1);
  });

  it('should rename an object', async () => {
    // given
    const objectWorkingId = 12345;
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const mockedSaveObjects = jest
      .spyOn(officeStoreObject, 'saveObjectsInExcelStore')
      .mockImplementation();

    // when
    await sidePanelService.rename(objectWorkingId, 'name');
    // then
    expect(mockedDispatch).toHaveBeenCalledTimes(1);
    expect(mockedSaveObjects).toHaveBeenCalledTimes(1);
  });

  it('should refresh objects', async () => {
    // given
    const objectWorkingIds = [1, 2, 3, 4, 5];
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    // when
    await sidePanelService.refresh(...objectWorkingIds);
    // then

    expect(mockedDispatch).toHaveBeenCalledTimes(objectWorkingIds.length);
  });

  it('should remove objects', async () => {
    // given
    const objectWorkingIds = [12, 34, 56];
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    // when
    await sidePanelService.remove(...objectWorkingIds);
    // then
    expect(mockedDispatch).toHaveBeenCalledTimes(objectWorkingIds.length);
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
    } as unknown as ObjectData;

    const mockedGetExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation();
    const mockedisSheetProtected = jest
      .spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected')
      .mockImplementation();
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    // when
    await sidePanelService.edit(objectWorkingId);

    // then
    expect(mockedGetExcelContext).toHaveBeenCalled();
    expect(mockedisSheetProtected).toHaveBeenCalled();
    expect(getObjectFromObjectReducerByObjectWorkingId).toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalled();
  });

  it.each`
    objectType
    ${'report'}
    ${'dataset'}
    ${'visualization'}
  `('should reprompt an object based on type', async ({ objectType }) => {
    // given
    const objectWorkingId = 1;
    const mockObject = {
      bindId: 1,
      mstrObjectType: { name: objectType },
      isPrompted: true,
    } as unknown as ObjectData;

    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);
    const clearRepromptTaskMockup = jest
      .spyOn(sidePanelHelper, 'clearRepromptTask')
      .mockImplementation();

    // when
    await sidePanelService.reprompt([objectWorkingId]);

    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalled();
    expect(clearRepromptTaskMockup).toHaveBeenCalled();
  });

  it('should reprompt an object', async () => {
    // given
    const objectWorkingIds = [1, 1];
    const mockObject = {
      bindId: 1,
      mstrObjectType: { name: 'report' },
      isPrompted: false,
    } as unknown as ObjectData;

    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementation(() => mockObject);

    const clearRepromptTaskMockup = jest
      .spyOn(sidePanelHelper, 'clearRepromptTask')
      .mockImplementation();

    // when
    await sidePanelService.reprompt(objectWorkingIds);

    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalled();
    expect(clearRepromptTaskMockup).toHaveBeenCalled();
  });

  it('handleViewData should change flags and refresh objects', async () => {
    // given
    const mockedSessionCheck = jest
      .spyOn(authenticationHelper, 'checkStatusOfSessions')
      .mockImplementation();
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const mockedRefresh = jest.spyOn(SidePanelService.prototype, 'refresh').mockImplementation();
    jest.spyOn(toggleFlag.officeActions, 'toggleIsClearDataFailedFlag').mockImplementation();
    jest.spyOn(toggleFlag.officeActions, 'toggleSecuredFlag').mockImplementation();
    jest.spyOn(officeStoreHelper, 'setPropertyValue').mockImplementation();

    // when
    await sidePanelService.viewData();

    // then
    expect(mockedSessionCheck).toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalledTimes(2);
    expect(mockedRefresh).toHaveBeenCalledTimes(1);
  });
});
