import { officeApiHelper } from '../../office/api/office-api-helper';
import { sidePanelEventHelper } from '../../right-side-panel/side-panel-event-helper';

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

  const mockedExcelContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue(exceContext);
  // when
  await sidePanelEventHelper.addRemoveObjectListener();
  // then

  expect(mockedExcelContext).toBeCalled();
  expect(mockedAddEvent).toBeCalledTimes(eventAddedTimes);
});
});
