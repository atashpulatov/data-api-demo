import { reduxStore } from '../../store';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-notification-helper';
import { sidePanelService } from '../../right-side-panel/side-panel-service';
import { officeApiHelper } from '../../office/api/office-api-helper';
import * as toggleFlag from '../../redux-reducer/office-reducer/office-actions';
import { errorService } from '../../error/error-handler';
import { homeHelper } from '../../home/home-helper';
import { notificationService } from '../../notification-v2/notification-service';

describe('SidePanelService', () => {
  beforeEach(() => {
    sidePanelNotificationHelper.popupTypes = {
      DUPLICATE: 'duplicate',
      RANGE_TAKEN: 'range_taken',
      DATA_CLEARED: 'data_cleared',
      DATA_CLEARED_FAILED: 'data_cleared_failed',
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('setRangeTakenPopup should set up range taken popup', () => {
    // given
    const objectWorkingId = 1;
    const activeCellAddress = 'A1';
    const setSidePanelPopup = jest.fn();
    const callback = jest.fn();

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    sidePanelNotificationHelper.setRangeTakenPopup({ objectWorkingId, activeCellAddress, setSidePanelPopup, callback });
    // then
    expect(setSidePanelPopup).toBeCalledTimes(1);
  });

  it('setDuplicatePopup should set up duplicate popup', () => {
    // given
    const objectWorkingId = 1;
    const activeCellAddress = 'A1';
    const setSidePanelPopup = jest.fn();
    const setDuplicatedObjectId = jest.fn();

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    sidePanelNotificationHelper.setDuplicatePopup({
      objectWorkingId,
      activeCellAddress,
      setSidePanelPopup,
      setDuplicatedObjectId });
    // then
    expect(setSidePanelPopup).toBeCalledTimes(1);
  });

  it('importInNewRange should dispatch popup data', () => {
    // given
    const objectWorkingId = 1;
    const startCell = 'A1';
    const insertNewWorksheet = true;

    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    const expectedObject = {
      payload: {
        insertNewWorksheet,
        objectWorkingId,
        startCell,
        repeatStep: true,
        tableChanged: true,
      },
      type: 'UPDATE_OPERATION',
    };
    // when
    sidePanelNotificationHelper.importInNewRange(objectWorkingId, startCell, insertNewWorksheet);
    // then
    expect(mockedDispatch).toBeCalledWith(expectedObject);
    expect(mockedDispatch).toBeCalledTimes(1);
  });

  it('injectNotificationsToObjects should set up range taken popup', () => {
    // given
    const objectWorkingId = 1;
    const loadedObjects = [{ objectWorkingId }];
    const notifications = [{ objectWorkingId, notificationData: 'data' }];
    const operations = [{ objectWorkingId }];

    const expectedObjects = [{
      objectWorkingId,
      notification: notifications[0],
    }];

    jest.spyOn(sidePanelNotificationHelper, 'shouldGenerateProgressPercentage').mockImplementation();

    // when
    const object = sidePanelNotificationHelper.injectNotificationsToObjects(loadedObjects, notifications, operations);
    // then
    expect(object).toMatchObject(expectedObjects);
  });

  it.each`
  isSecured   | isClearDataFailed | popupType
  
  ${true}     | ${false}          | ${'data_cleared'}
  ${false}    | ${true}           | ${'data_cleared_failed'}
  
  `('setClearDataPopups should setup correct clear data popup', ({ isSecured, isClearDataFailed, popupType }) => {
  // given
    const mockedDispatch = jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ officeReducer: { isSecured, isClearDataFailed } });
    const mockedViewData = jest.spyOn(sidePanelNotificationHelper, 'handleViewData').mockImplementation();

    const expectedObject = {
      onViewData: mockedViewData,
      type: popupType,
    };
    // when
    const popup = sidePanelNotificationHelper.setClearDataPopups();
    // then
    expect({ ...popup }).toMatchObject(expectedObject);
    expect(mockedDispatch).toBeCalledTimes(1);
  });

  it('handleViewData should change flags anre refresh objects', async () => {
    // given
    const mockedSessionCheck = jest.spyOn(officeApiHelper, 'checkStatusOfSessions').mockImplementation();
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const mockedRefresh = jest.spyOn(sidePanelService, 'refresh').mockImplementation();
    toggleFlag.toggleSecuredFlag = jest.fn();
    toggleFlag.toggleIsClearDataFailedFlag = jest.fn();

    // when
    await sidePanelNotificationHelper.handleViewData();

    // then
    expect(mockedSessionCheck).toBeCalledTimes(1);
    expect(mockedDispatch).toBeCalledTimes(2);
    expect(mockedRefresh).toBeCalledTimes(1);
  });

  it.each`
    operationType             | expectedResult

    ${'IMPORT_OPERATION'}     | ${true}
    ${'EDIT_OPERATION'}       | ${true}
    ${'REFRESH_OPERATION'}    | ${true}
    ${'DUPLICATE_OPERATION'}  | ${true}
    ${'REMOVE_OPERATION'}     | ${false}
    ${'HIGHLIGHT_OPERATION'}  | ${false}
    ${'CLEAR_DATA_OPERATION'} | ${false}

  `('shouldGenerateProgressPercentage should return correct boolean for operation type', ({ operationType, expectedResult }) => {
  // given
    const objectOperation = { operationType };

    // when
    const returnedValue = sidePanelNotificationHelper.shouldGenerateProgressPercentage(objectOperation);
    // then
    expect(returnedValue).toBe(expectedResult);
  });

  it.each`
  error                                         | isMacAndSafariBased | handleErrorCalledTimes | connectionLostCalledTimes | connectionCheckerCalledTimes

  ${'Possible causes: the network is offline,'} | ${true}             | ${0}                   | ${1}                      | ${1}
  ${'Possible causes: the network is offline,'} | ${false}            | ${0}                   | ${0}                      | ${0}
  ${'error'}                                    | ${true}             | ${1}                   | ${0}                      | ${0}
  ${'error'}                                    | ${false}            | ${1}                   | ${0}                      | ${0}

`('should handle Side Panel Action Error', ({ error, isMacAndSafariBased, handleErrorCalledTimes, connectionLostCalledTimes, connectionCheckerCalledTimes }) => {
  // given
    const mockHandleError = jest.spyOn(errorService, 'handleError').mockImplementation();
    const mockedConnectionLost = jest.spyOn(notificationService, 'connectionLost').mockImplementation();
    const mockedConnectionCheckerp = jest.spyOn(sidePanelNotificationHelper, 'connectionCheckerLoop').mockImplementation();
    jest.spyOn(homeHelper, 'isMacAndSafariBased').mockReturnValueOnce(isMacAndSafariBased);

    // when
    sidePanelNotificationHelper.handleSidePanelActionError(error);
    // then

    expect(mockHandleError).toBeCalledTimes(handleErrorCalledTimes);
    expect(mockedConnectionLost).toBeCalledTimes(connectionLostCalledTimes);
    expect(mockedConnectionCheckerp).toBeCalledTimes(connectionCheckerCalledTimes);
  });
});
