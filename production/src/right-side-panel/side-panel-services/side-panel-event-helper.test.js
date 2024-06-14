import { authenticationHelper } from '../../authentication/authentication-helper';
import { notificationService } from '../../notification/notification-service';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiService } from '../../office/api/office-api-service';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { sidePanelEventHelper } from './side-panel-event-helper';
import { sidePanelService } from './side-panel-service';

import { reduxStore } from '../../store';

describe('SidePanelService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call excel contex methods form initActiveSelectionChangedListener', async () => {
    // given
    const mockSync = jest.fn();
    const mockContext = { sync: mockSync };
    const mockActiveCell = 'Sheet123!ABC123';
    const mockActiveWorksheetId = '123';

    const spyGetExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementationOnce(() => mockContext);

    const spyGetSelectedCell = jest
      .spyOn(officeApiService, 'getSelectedCell')
      .mockImplementationOnce(() => mockActiveCell);

    const spyGetCurrentExcelSheet = jest
      .spyOn(officeApiHelper, 'getCurrentExcelSheet')
      .mockImplementationOnce(() => ({
        load: jest.fn(),
        id: mockActiveWorksheetId,
      }));

    const spyDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    const mockSetActiveSheetId = jest.fn();
    const mockIsAnyPopupOrSettingsDisplayed = false;

    const spyAddOnSelectionChangedListener = jest
      .spyOn(officeApiService, 'addOnSelectionChangedListener')
      .mockImplementationOnce(() => {});

    // when
    await sidePanelEventHelper.initActiveSelectionChangedListener(
      mockSetActiveSheetId,
      mockIsAnyPopupOrSettingsDisplayed
    );
    // then
    expect(spyGetExcelContext).toHaveBeenCalled();
    expect(spyGetSelectedCell).toHaveBeenCalledWith(mockContext);
    expect(spyGetCurrentExcelSheet).toHaveBeenCalledWith(mockContext);
    expect(spyDispatch).toHaveBeenCalled();
    expect(mockSetActiveSheetId).toHaveBeenCalledWith(mockActiveWorksheetId);
    expect(spyAddOnSelectionChangedListener).toHaveBeenCalledWith(
      mockContext,
      mockSetActiveSheetId,
      mockIsAnyPopupOrSettingsDisplayed
    );
  });

  it('should remove objects in setOnDeletedTablesEvent', async () => {
    // given
    const object = { objectWorkingId: 1, bindId: 1 };
    const eventObject = { tableId: 1 };

    const mockedExcelContext = jest
      .spyOn(authenticationHelper, 'checkStatusOfSessions')
      .mockImplementation();
    const mockedGetObjects = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByBindId')
      .mockReturnValueOnce(object);
    const mockedRemoveNotification = jest
      .spyOn(notificationService, 'removeExistingNotification')
      .mockImplementation();
    const mockedRemove = jest.spyOn(sidePanelService, 'remove').mockImplementation();

    // when
    await sidePanelEventHelper.setOnDeletedTablesEvent(eventObject);
    // then
    expect(mockedExcelContext).toBeCalled();
    expect(mockedGetObjects).toBeCalled();
    expect(mockedRemoveNotification).toBeCalled();
    expect(mockedRemove).toBeCalled();
    expect(mockedRemove).toBeCalledWith(1);
  });

  it('should remove objects in setOnDeletedWorksheetEvent', async () => {
    // given
    const mockSync = jest.fn();
    const mockedLoad = jest.fn();
    const objectsList = [
      { objectWorkingId: 1, bindId: 1 },
      { objectWorkingId: 2, bindId: 2 },
    ];
    const objectsOfSheets = [{ objectWorkingId: 1, id: 1 }];

    const mockedExcelContext = jest
      .spyOn(authenticationHelper, 'checkStatusOfSessions')
      .mockImplementation();
    const mockedGetObjects = jest
      .spyOn(officeReducerHelper, 'getObjectsListFromObjectReducer')
      .mockReturnValueOnce(objectsList);
    const mockedRemoveNotification = jest
      .spyOn(notificationService, 'removeExistingNotification')
      .mockImplementation();
    const mockedRemove = jest.spyOn(sidePanelService, 'remove').mockImplementation();

    const excelContext = {
      sync: mockSync,
      workbook: {
        tables: {
          items: objectsOfSheets,
          load: mockedLoad,
        },
      },
    };

    // when
    await sidePanelEventHelper.setOnDeletedWorksheetEvent(excelContext);
    // then
    expect(mockedExcelContext).toBeCalled();
    expect(mockedGetObjects).toBeCalled();
    expect(mockedRemoveNotification).toBeCalled();
    expect(mockedRemove).toBeCalled();
    expect(mockedRemove).toBeCalledWith(2);
  });

  it.each`
    firstCall | secondCall | eventAddedTimes
    ${true}   | ${false}   | ${1}
    ${false}  | ${true}    | ${1}
    ${false}  | ${false}   | ${0}
  `(
    'should set up event listeners in addRemoveObjectListener',
    async ({ firstCall, secondCall, eventAddedTimes }) => {
      // given
      const mockSync = jest.fn();
      const mockedAddEvent = jest.fn();
      const mockedisSetSupported = jest
        .fn()
        .mockReturnValueOnce(firstCall)
        .mockReturnValueOnce(secondCall);

      const exceContext = {
        sync: mockSync,
        workbook: {
          tables: { onDeleted: { add: mockedAddEvent } },
          worksheets: { onDeleted: { add: mockedAddEvent } },
        },
      };
      window.Office = {
        context: {
          requirements: { isSetSupported: mockedisSetSupported },
        },
      };

      jest.spyOn(sidePanelEventHelper, 'setOnDeletedWorksheetEvent').mockImplementation();
      const mockedExcelContext = jest
        .spyOn(officeApiHelper, 'getExcelContext')
        .mockReturnValue(exceContext);
      // when
      await sidePanelEventHelper.addRemoveObjectListener();
      // then

      expect(mockedExcelContext).toBeCalled();
      expect(mockedAddEvent).toBeCalledTimes(eventAddedTimes);
    }
  );

  it('should call advanced event listener helpers in initObjectWorksheetTrackingListeners when isAdvancedWorksheetTrackingSupported true', async () => {
    // given
    const mockSync = jest.fn();
    const mockedExcelContext = {
      sync: mockSync,
      workbook: {
        worksheets: {},
      },
    };

    const mockedGetState = jest.spyOn(reduxStore, 'getState').mockReturnValue({
      officeReducer: { isAdvancedWorksheetTrackingSupported: true },
    });
    const mockedGetExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockReturnValue(mockedExcelContext);
    const mockedOnNameChangedHelper = jest
      .spyOn(sidePanelEventHelper, 'setObjectTrackingOnNameChangedWorksheetEvent')
      .mockImplementation();
    const mockedOnMovedHelper = jest
      .spyOn(sidePanelEventHelper, 'setObjectTrackingOnMovedWorksheetEvent')
      .mockImplementation();
    const mockedOnAddedHelper = jest
      .spyOn(sidePanelEventHelper, 'setObjectTrackingOnAddedWorksheetEvent')
      .mockImplementation();
    const mockedOnDeletedHelper = jest
      .spyOn(sidePanelEventHelper, 'setObjectTrackingOnDeletedWorksheetEvent')
      .mockImplementation();

    // when
    await sidePanelEventHelper.initObjectWorksheetTrackingListeners();

    // then
    expect(mockedGetState).toHaveBeenCalledTimes(1);
    expect(mockedGetExcelContext).toHaveBeenCalledTimes(1);
    expect(mockedOnNameChangedHelper).toHaveBeenCalledTimes(1);
    expect(mockedOnMovedHelper).toHaveBeenCalledTimes(1);
    expect(mockedOnAddedHelper).toHaveBeenCalledTimes(1);
    expect(mockedOnDeletedHelper).toHaveBeenCalledTimes(1);
    expect(mockSync).toHaveBeenCalledTimes(1);
  });

  it('should call basic event listener helper in initObjectWorksheetTrackingListeners when isAdvancedWorksheetTrackingSupported false', async () => {
    // given
    const mockedExcelContext = {
      workbook: {
        worksheets: {},
      },
    };

    const mockedGetState = jest.spyOn(reduxStore, 'getState').mockReturnValue({
      officeReducer: { isAdvancedWorksheetTrackingSupported: false },
    });
    const mockedGetExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockReturnValue(mockedExcelContext);
    const mockedDocumentSelectionChangedHelper = jest
      .spyOn(sidePanelEventHelper, 'setObjectTrackingDocumentSelectionChangedEvent')
      .mockImplementation();

    // when
    await sidePanelEventHelper.initObjectWorksheetTrackingListeners();

    // then
    expect(mockedGetState).toHaveBeenCalledTimes(1);
    expect(mockedGetExcelContext).toHaveBeenCalledTimes(1);
    expect(mockedDocumentSelectionChangedHelper).toHaveBeenCalledTimes(1);
  });

  it('should properly set event listener in setObjectTrackingOnNameChangedWorksheetEvent', () => {
    // given
    const mockAddEvent = jest.fn();
    const mockedWorksheets = { onNameChanged: { add: mockAddEvent } };

    // when
    sidePanelEventHelper.setObjectTrackingOnNameChangedWorksheetEvent(mockedWorksheets);

    // then
    expect(mockAddEvent).toHaveBeenCalledTimes(1);
  });

  it('should properly set event listener in setObjectTrackingOnMovedWorksheetEvent', () => {
    // given
    const mockAddEvent = jest.fn();
    const mockedWorksheets = { onMoved: { add: mockAddEvent } };
    const mockedExcelContext = {};

    // when
    sidePanelEventHelper.setObjectTrackingOnMovedWorksheetEvent(
      mockedWorksheets,
      mockedExcelContext
    );

    // then
    expect(mockAddEvent).toHaveBeenCalledTimes(1);
  });

  it('should properly set event listener in setObjectTrackingOnAddedWorksheetEvent', () => {
    // given
    const mockAddEvent = jest.fn();
    const mockedWorksheets = { onAdded: { add: mockAddEvent } };
    const mockedExcelContext = {};

    // when
    sidePanelEventHelper.setObjectTrackingOnAddedWorksheetEvent(
      mockedWorksheets,
      mockedExcelContext
    );

    // then
    expect(mockAddEvent).toHaveBeenCalledTimes(1);
  });

  it('should properly set event listener in setObjectTrackingOnDeletedWorksheetEvent', () => {
    // given
    const mockAddEvent = jest.fn();
    const mockedWorksheets = { onDeleted: { add: mockAddEvent } };
    const mockedExcelContext = {};

    // when
    sidePanelEventHelper.setObjectTrackingOnDeletedWorksheetEvent(
      mockedWorksheets,
      mockedExcelContext
    );

    // then
    expect(mockAddEvent).toHaveBeenCalledTimes(1);
  });

  it('should properly set event listener in setObjectTrackingDocumentSelectionChangedEvent', () => {
    // given
    const mockedAddHandlerAsync = jest.fn();
    global.Office = {
      context: {
        document: {
          addHandlerAsync: mockedAddHandlerAsync,
        },
      },
      EventType: {
        DocumentSelectionChanged: 'DocumentSelectionChanged',
      },
    };
    const mockedWorksheets = {};
    const mockedExcelContext = {};

    // when
    sidePanelEventHelper.setObjectTrackingDocumentSelectionChangedEvent(
      mockedWorksheets,
      mockedExcelContext
    );

    // then
    expect(mockedAddHandlerAsync).toHaveBeenCalledTimes(1);
  });
});
