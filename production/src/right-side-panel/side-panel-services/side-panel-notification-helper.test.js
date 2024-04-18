import { sidePanelNotificationHelper } from './side-panel-notification-helper';
import { sidePanelService } from './side-panel-service';

import { reduxStore } from '../../store';

describe('SidePanelService', () => {
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
    sidePanelNotificationHelper.setRangeTakenPopup({
      objectWorkingId,
      activeCellAddress,
      setSidePanelPopup,
      callback,
    });
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
      setDuplicatedObjectId,
    });
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
    const operations = [{ objectWorkingId, operationType: 'EDIT_OPERATION' }];

    const expectedObjects = [
      {
        objectWorkingId,
        notification: notifications[0],
      },
    ];

    jest
      .spyOn(sidePanelNotificationHelper, 'shouldGenerateProgressPercentage')
      .mockImplementation(() => true);

    // when
    const object = sidePanelNotificationHelper.injectNotificationsToObjects(
      loadedObjects,
      notifications,
      operations
    );
    // then
    expect(object).toMatchObject(expectedObjects);
  });

  it.each`
    isSecured | isClearDataFailed | popupType
    ${true}   | ${false}          | ${'data_cleared'}
    ${false}  | ${true}           | ${'data_cleared_failed'}
  `(
    'setClearDataPopups should setup correct clear data popup',
    ({ isSecured, isClearDataFailed, popupType }) => {
      // given
      const mockedDispatch = jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({
        officeReducer: { isSecured, isClearDataFailed },
      });
      const mockedViewData = jest.spyOn(sidePanelService, 'viewData').mockImplementation();

      const expectedObject = {
        onViewData: mockedViewData,
        type: popupType,
      };
      // when
      const popup = sidePanelNotificationHelper.setClearDataPopups(mockedViewData);
      // then
      expect({ ...popup }).toMatchObject(expectedObject);
      expect(mockedDispatch).toBeCalledTimes(1);
    }
  );

  it.each`
    operationType             | expectedResult
    ${'IMPORT_OPERATION'}     | ${true}
    ${'EDIT_OPERATION'}       | ${true}
    ${'REFRESH_OPERATION'}    | ${true}
    ${'DUPLICATE_OPERATION'}  | ${true}
    ${'REMOVE_OPERATION'}     | ${false}
    ${'HIGHLIGHT_OPERATION'}  | ${false}
    ${'CLEAR_DATA_OPERATION'} | ${false}
  `(
    'shouldGenerateProgressPercentage should return correct boolean for operation type',
    ({ operationType, expectedResult }) => {
      // given
      const objectOperation = { operationType };

      // when
      const returnedValue =
        sidePanelNotificationHelper.shouldGenerateProgressPercentage(objectOperation);
      // then
      expect(returnedValue).toBe(expectedResult);
    }
  );
});
