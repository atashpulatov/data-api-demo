import { officeApiHelper } from '../../office/api/office-api-helper';
import { sidePanelEventHelper } from '../../right-side-panel/side-panel-event-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { notificationService } from '../../notification-v2/notification-service';
import { sidePanelService } from '../../right-side-panel/side-panel-service';

describe('SidePanelService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call excel contex methods form initializeActiveCellChangedListener', async () => {
    // given
    const mockSync = jest.fn();
    const mockContext = { sync: mockSync };
    const mockActiveCell = 'Sheet123!ABC123';

    const spyGetExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementationOnce(() => mockContext);

    const spyGetSelectedCell = jest
      .spyOn(officeApiHelper, 'getSelectedCell')
      .mockImplementationOnce(() => mockActiveCell);

    const stateSetterCallback = jest.fn();

    const spyAddOnSelectionChangedListener = jest
      .spyOn(officeApiHelper, 'addOnSelectionChangedListener')
      .mockImplementationOnce(() => { });

    // when
    await sidePanelEventHelper.initializeActiveCellChangedListener(stateSetterCallback);
    // then
    expect(spyGetExcelContext).toBeCalled();
    expect(spyGetSelectedCell).toBeCalledWith(mockContext);
    expect(stateSetterCallback).toBeCalledWith(mockActiveCell);
    expect(spyAddOnSelectionChangedListener).toBeCalledWith(mockContext, stateSetterCallback);
  });

  it('should remove objects in setOnDeletedTablesEvent', async () => {
    // given
    const object = { objectWorkingId: 1, bindId: 1 };
    const eventObject = { tableId: 1 };

    const mockedExcelContext = jest.spyOn(officeApiHelper, 'checkStatusOfSessions').mockImplementation();
    const mockedGetObjects = jest.spyOn(officeReducerHelper, 'getObjectFromObjectReducerByBindId').mockReturnValueOnce(object);
    const mockedRemoveNotification = jest.spyOn(notificationService, 'removeExistingNotification').mockImplementation();
    const mockedRemove = jest.spyOn(sidePanelService, 'remove').mockImplementation();

    // when
    await sidePanelEventHelper.setOnDeletedTablesEvent(eventObject);
    // then
    expect(mockedExcelContext).toBeCalled();
    expect(mockedGetObjects).toBeCalled();
    expect(mockedRemoveNotification).toBeCalled();
    expect(mockedRemove).toBeCalled();
    expect(mockedRemove).toBeCalledWith([1]);
  });

  it('should remove objects in setOnDeletedWorksheetEvent', async () => {
  // given
    const mockSync = jest.fn();
    const mockedLoad = jest.fn();
    const objectsList = [{ objectWorkingId: 1, bindId: 1 }, { objectWorkingId: 2, bindId: 2 }];
    const objectsOfSheets = [{ objectWorkingId: 1, id: 1 }];

    const mockedExcelContext = jest.spyOn(officeApiHelper, 'checkStatusOfSessions').mockImplementation();
    const mockedGetObjects = jest.spyOn(officeReducerHelper, 'getObjectsListFromObjectReducer').mockReturnValueOnce(objectsList);
    const mockedRemoveNotification = jest.spyOn(notificationService, 'removeExistingNotification').mockImplementation();
    const mockedRemove = jest.spyOn(sidePanelService, 'remove').mockImplementation();

    const excelContext = {
      sync: mockSync,
      workbook: {
        tables: {
          items: objectsOfSheets,
          load: mockedLoad }
      } };

    // when
    await sidePanelEventHelper.setOnDeletedWorksheetEvent(excelContext);
    // then
    expect(mockedExcelContext).toBeCalled();
    expect(mockedGetObjects).toBeCalled();
    expect(mockedRemoveNotification).toBeCalled();
    expect(mockedRemove).toBeCalled();
    expect(mockedRemove).toBeCalledWith([2]);
  });

  it.each`
  version   | firstCall | secondCall | eventAddedTimes

  ${1.9}    | ${true}   | ${false}   | ${1}
  ${1.7}    | ${false}  | ${true}    | ${1}
  ${1.1}    | ${false}  | ${false}   | ${0}

  `('should set up event listeners in addRemoveObjectListener', async ({ version, firstCall, secondCall, eventAddedTimes }) => {
  // given
    const mockSync = jest.fn();
    const mockedAddEvent = jest.fn();
    const mockedisSetSupported = jest.fn().mockReturnValueOnce(firstCall).mockReturnValueOnce(secondCall);

    const exceContext = { sync: mockSync, workbook: {
      tables: { onDeleted: { add: mockedAddEvent } },
      worksheets: { onDeleted: { add: mockedAddEvent } } }
    };
    window.Office = {
      context: {
        requirements: { isSetSupported: mockedisSetSupported }
      }
    };

    jest.spyOn(sidePanelEventHelper, 'setOnDeletedWorksheetEvent').mockImplementation();
    const mockedExcelContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue(exceContext);
    // when
    await sidePanelEventHelper.addRemoveObjectListener();
    // then

    expect(mockedExcelContext).toBeCalled();
    expect(mockedAddEvent).toBeCalledTimes(eventAddedTimes);
  });
});
