import officeReducerHelper from '../../../office/store/office-reducer-helper';
import { objectImportType } from '../../../mstr-object/constants';
import { REFRESH_OPERATION, HIGHLIGHT_OPERATION } from '../../../operation/operation-type-names';

describe('OfficeReducerHelper init', () => {
  it('init work as expected', () => {
    // given
    // when
    officeReducerHelper.init('initTest');

    // then
    expect(officeReducerHelper.reduxStore).toEqual('initTest');
  });
});

describe('OfficeReducerHelper', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockObjects = [{ importType: objectImportType.TABLE }, { importType: objectImportType.IMAGE }];
  const reduxStoreMock = {
    getState: () => ({
      objectReducer: {
        objects: mockObjects,
      },
      operationReducer: {
        operations: [{ operationType: HIGHLIGHT_OPERATION, objectWorkingId: 42 },
          { operationType: REFRESH_OPERATION, objectWorkingId: 69 }],
      },
      officeReducer: {
        isShapeAPISupported: true,
      },
    })
  };

  it('getObjectsListFromObjectReducer works as expected', () => {
    // given
    officeReducerHelper.init(reduxStoreMock);

    // when
    const result = officeReducerHelper.getObjectsListFromObjectReducer();

    // then
    expect(result).toEqual(mockObjects);
  });

  it('getOperationsListFromOperationReducer works as expected', () => {
    // given
    officeReducerHelper.init(reduxStoreMock);
    const expectedOperations = [{ operationType: REFRESH_OPERATION, objectWorkingId: 69 }];

    // when
    const result = officeReducerHelper.getOperationsListFromOperationReducer();

    // then
    expect(result).toEqual(expectedOperations);
  });

  it.each`
  expectedNoOperationInProgress | operationsListParam
  
  ${true}                       | ${[]}
  ${false}                      | ${[42]}
  ${false}                      | ${[42, 42]}
  
  `('noOperationInProgress works as expected',
    ({ expectedNoOperationInProgress, operationsListParam }) => {
    // given
      jest.spyOn(officeReducerHelper, 'getOperationsListFromOperationReducer').mockReturnValue(operationsListParam);

      // when
      const result = officeReducerHelper.noOperationInProgress();

      // then
      expect(officeReducerHelper.getOperationsListFromOperationReducer).toBeCalledTimes(1);

      expect(result).toEqual(expectedNoOperationInProgress);
    });

  it('clearPopupData should dispatch proper Redux action', () => {
    // given
    officeReducerHelper.init(reduxStoreMock);
    officeReducerHelper.reduxStore.dispatch = jest.fn();

    // when
    officeReducerHelper.clearPopupData();

    // then
    expect(officeReducerHelper.reduxStore.dispatch).toHaveBeenCalledTimes(1);
    expect(officeReducerHelper.reduxStore.dispatch).toHaveBeenCalledWith({ type: 'OFFICE_SET_POPUP_DATA' });
  });
});

describe('OfficeReducerHelper getObjectFromObjectReducerByBindId', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
  expectedObject      | bindIdParam | objectsParam
  
  ${undefined}        | ${42}       | ${[]}
  ${undefined}        | ${42}       | ${[{ bindId: 4242 }]}
  ${{ bindId: 42 }}   | ${42}       | ${[{ bindId: 42 }]}
  ${{ bindId: 42 }}   | ${42}       | ${[{ bindId: 4242 }, { bindId: 42 }]}

  `('getObjectFromObjectReducer works as expected',
    ({ expectedObject, bindIdParam, objectsParam }) => {
    // given
      const reduxStoreMock = {
        getState: () => ({
          objectReducer: {
            objects: objectsParam,
          },
        })
      };

      officeReducerHelper.init(reduxStoreMock);

      // when
      const result = officeReducerHelper.getObjectFromObjectReducerByBindId(bindIdParam);

      // then
      expect(result).toEqual(expectedObject);
    });
});
