import { officeApiHelper } from '../../office/api/office-api-helper';
import { popupActions } from '../../redux-reducer/popup-reducer/popup-actions';
import * as operationActions from '../../redux-reducer/operation-reducer/operation-actions';
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
});
