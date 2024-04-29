/* eslint-disable no-import-assign */
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import officeStoreHelper from '../../office/store/office-store-helper';
import { sidePanelHelper } from './side-panel-helper';

import { reduxStore } from '../../store';

import { MstrObjectTypes } from '../../mstr-object/mstr-object-types';
import { ObjectData } from '../../types/object-types';

import * as operationActions from '../../redux-reducer/operation-reducer/operation-actions';
import { popupActions } from '../../redux-reducer/popup-reducer/popup-actions';

describe('SidePanelHelper', () => {
  jest.useFakeTimers();

  let duplicateRequestedOriginal: any;
  let callForDuplicateOriginal: any;
  beforeAll(() => {
    duplicateRequestedOriginal = operationActions.duplicateRequested;
    // @ts-ignore
    operationActions.duplicateRequested = jest.fn().mockReturnValue('duplicateRequestedTest');

    // @ts-ignore
    callForDuplicateOriginal = popupActions.duplicateRequested;
    popupActions.callForDuplicate = jest.fn().mockReturnValue('callForDuplicateTest');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    // @ts-ignore
    operationActions.duplicateRequested = duplicateRequestedOriginal;
    popupActions.callForDuplicate = callForDuplicateOriginal;
  });

  it('should dispatch duplicateRequested for duplicate with import', () => {
    // given
    const objectWorkingId = 12345;
    const insertNewWorksheet = true;
    const withEdit = false;
    const mockObject = {
      data: 'data',
      bindId: 'test',
      tableName: 'name',
      refreshDate: 'date',
      preparedInstanceId: 'instance id',
      subtotalsInfo: { subtotalsAddresses: [] },
    } as unknown as ObjectData;
    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    const expectedObject = {
      data: 'data',
      insertNewWorksheet,
      objectWorkingId: 789,
      subtotalsInfo: {},
    };

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    Date.now = jest.fn().mockImplementationOnce(() => 789);
    // when
    sidePanelHelper.duplicateObject(objectWorkingId, insertNewWorksheet, withEdit);
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
      data: 'data',
      bindId: 'test',
      tableName: 'name',
      refreshDate: 'date',
      preparedInstanceId: 'instance id',
      subtotalsInfo: { subtotalsAddresses: [] },
    } as unknown as ObjectData;

    const getObjectFromObjectReducerByObjectWorkingId = jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockImplementationOnce(() => mockObject);

    const expectedObject = {
      data: 'data',
      insertNewWorksheet,
      objectWorkingId: 789,
      subtotalsInfo: {},
    };

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();
    Date.now = jest.fn().mockImplementationOnce(() => 789);
    // when
    sidePanelHelper.duplicateObject(objectWorkingId, insertNewWorksheet, withEdit);
    // then
    expect(getObjectFromObjectReducerByObjectWorkingId).toBeCalledWith(objectWorkingId);
    expect(popupActions.callForDuplicate).toBeCalledTimes(1);
    expect(popupActions.callForDuplicate).toBeCalledWith(expectedObject);
  });

  it.each`
    objectType
    ${'report'}
    ${'visualization'}
  `(
    'createRepromptTask should return an object containing a callback, which when called, will properly call officeApi helpers and dispatch an action',
    async ({ objectType }) => {
      // given
      const mockObject = {
        bindId: '1',
        mstrObjectType: { name: objectType } as MstrObjectTypes,
      };

      const mockedGetExcelContext = jest
        .spyOn(officeApiHelper, 'getExcelContext')
        .mockImplementation();
      const mockedisSheetProtected = jest
        .spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected')
        .mockImplementation();
      const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

      // when
      const { isPrompted, callback } = sidePanelHelper.createRepromptTask(
        mockObject.bindId,
        mockObject.mstrObjectType,
        true
      );
      await callback();

      // then
      expect(isPrompted).toBeTruthy();
      expect(mockedGetExcelContext).toBeCalled();
      expect(mockedisSheetProtected).toBeCalled();
      expect(mockedDispatch).toBeCalled();
    }
  );

  it('should call toggleSecureFlag if file is secured', () => {
    // given
    jest.spyOn(officeStoreHelper, 'isFileSecured').mockReturnValue(true);
    jest.spyOn(officeStoreHelper, 'isClearDataFailed').mockReturnValue(true);
    const distchMock = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    sidePanelHelper.initializeClearDataFlags();

    // then
    expect(distchMock).toHaveBeenCalledTimes(2);
  });
});
