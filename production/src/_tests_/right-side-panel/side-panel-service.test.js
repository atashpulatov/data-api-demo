import { sidePanelService } from '../../right-side-panel/side-panel-service';
import { popupActions } from '../../redux-reducer/popup-reducer/popup-actions';
import * as operationActions from '../../redux-reducer/operation-reducer/operation-actions';
import { reduxStore } from '../../store';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { popupController } from '../../popup/popup-controller';

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

  it('should open popup on adddata click', () => {
    // given
    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    const mockedRunPopup = jest.spyOn(popupController, 'runPopupNavigation').mockImplementation();
    Date.now = jest.fn().mockImplementationOnce(() => 789);
    // when
    sidePanelService.addData();
    // then
    expect(mockedDispatch).toBeCalledTimes(1);
    expect(mockedRunPopup).toBeCalledTimes(1);
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
});
