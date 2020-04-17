import { sidePanelService } from '../../right-side-panel/side-panel-service';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { popupActions } from '../../redux-reducer/popup-reducer/popup-actions';
import * as operationActions from '../../redux-reducer/operation-reducer/operation-actions';
import { reduxStore } from '../../store';
import officeReducerHelper from '../../office/store/office-reducer-helper';

describe('SidePanelService', () => {
  let duplicateRequestedOriginal;
  let callForDuplicateOriginal;
  beforeAll(() => {
    duplicateRequestedOriginal = operationActions.duplicateRequested;
    operationActions.duplicateRequested = jest.fn().mockReturnValue('duplicateRequestedTest');

    callForDuplicateOriginal = popupActions.duplicateRequested;
    popupActions.callForDuplicate = jest.fn().mockReturnValue('callForDuplicateTest');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    operationActions.duplicateRequested = duplicateRequestedOriginal;
    popupActions.callForDuplicate = callForDuplicateOriginal;
  });

  it('should dispatch duplicateRequested for duplicate with import', () => {
    // given
    const objectWorkingId = 12345;
    const insertNewWorksheet = true;
    const withEdit = false;
    const mockObject = {
      data: 'data', bindId: 'test', tableName: 'name', refreshDate: 'date', preparedInstanceId: 'instance id',
    };
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    const expectedObject = {
      data: 'data',
      insertNewWorksheet,
      objectWorkingId: 789
    };

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    Date.now = jest.fn().mockImplementationOnce(() => 789);
    // when
    sidePanelService.duplicate(objectWorkingId, insertNewWorksheet, withEdit);
    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalledWith(objectWorkingId);
    expect(operationActions.duplicateRequested).toBeCalledTimes(1);
    expect(operationActions.duplicateRequested).toBeCalledWith(expectedObject);
  });

  it('should dispatch popupActions.callForDuplicate for duplicate with edit', () => {
    // given
    const objectWorkingId = 12345;
    const insertNewWorksheet = false;
    const withEdit = true;
    const mockObject = {
      data: 'data', bindId: 'test', tableName: 'name', refreshDate: 'date', preparedInstanceId: 'instance id',
    };
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    const expectedObject = {
      data: 'data',
      insertNewWorksheet,
      objectWorkingId: 789
    };

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    Date.now = jest.fn().mockImplementationOnce(() => 789);
    // when
    sidePanelService.duplicate(objectWorkingId, insertNewWorksheet, withEdit);
    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalledWith(objectWorkingId);
    expect(popupActions.callForDuplicate).toBeCalledTimes(1);
    expect(popupActions.callForDuplicate).toBeCalledWith(expectedObject);
  });

  it('should call excel contex methods form initializeActiveCellChangedListener', async () => {
    // given
    const mockSync = jest.fn();
    const mockContext = { sync: mockSync };
    const mockActiveCell = 'Sheet123!ABC123';

    const expectedActiveCellString = '$ABC$123';

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
    await sidePanelService.initializeActiveCellChangedListener(stateSetterCallback);
    // then
    expect(spyGetExcelContext).toBeCalled();
    expect(spyGetSelectedCell).toBeCalledWith(mockContext);
    expect(stateSetterCallback).toBeCalledWith(expectedActiveCellString);
    expect(spyAddOnSelectionChangedListener).toBeCalledWith(mockContext, stateSetterCallback);
  });
});
