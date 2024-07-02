import { sidePanelNotificationHelper } from './side-panel-notification-helper';
import { sidePanelService } from './side-panel-service';

import { reduxStore } from '../../store';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

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

  it('should call setSidePanelPopup when setPageByRefreshFailedPopup is triggered', () => {
    // given
    const objectWorkingId = 1;
    const selectedObjects = [
      { objectWorkingId: 1 },
      { objectWorkingId: 2 },
    ] as unknown as ObjectData[];
    const setSidePanelPopup = jest.fn();
    const callback = jest.fn();

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    sidePanelNotificationHelper.setPageByRefreshFailedPopup({
      objectWorkingId,
      selectedObjects,
      setSidePanelPopup,
      callback,
      edit: jest.fn(),
    });
    // then
    expect(setSidePanelPopup).toBeCalledTimes(1);
  });

  it('should call setSidePanelPopup when setPageByDuplicateFailedPopup is triggered', () => {
    // given
    const selectedObjects = [
      { objectWorkingId: 1 },
      { objectWorkingId: 2 },
    ] as unknown as ObjectData[];
    const setSidePanelPopup = jest.fn();
    const callback = jest.fn();

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    sidePanelNotificationHelper.setPageByDuplicateFailedPopup({
      selectedObjects,
      setSidePanelPopup,
      callback,
    });
    // then
    expect(setSidePanelPopup).toHaveBeenCalledTimes(1);
  });

  it('setPageByImportFailedPopup should set up range taken popup', () => {
    // given
    const objectWorkingId = 1;
    const setSidePanelPopup = jest.fn();
    const errorDetails = 'errorDetails';

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    sidePanelNotificationHelper.setPageByImportFailedPopup({
      objectWorkingId,
      setSidePanelPopup,
      errorDetails,
      callback: jest.fn(),
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

  it('injectNotificationsToObjects should set up range taken popup', () => {
    // given
    const objectWorkingId = 1;
    const loadedObjects = [{ objectWorkingId }] as unknown as ObjectData[];
    const notifications = [{ objectWorkingId, notificationData: 'data' }];
    const operations = [
      { objectWorkingId, operationType: 'EDIT_OPERATION' },
    ] as unknown as OperationData[];

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
        // @ts-expect-error
        officeReducer: { isSecured, isClearDataFailed },
      });
      const mockedViewData = jest.spyOn(sidePanelService, 'viewData').mockImplementation();

      const expectedObject = {
        onViewData: mockedViewData,
        type: popupType,
      };
      // when
      // @ts-expect-error
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
      const objectOperation = { operationType } as unknown as OperationData;

      // when
      const returnedValue =
        sidePanelNotificationHelper.shouldGenerateProgressPercentage(objectOperation);
      // then
      expect(returnedValue).toBe(expectedResult);
    }
  );
});
