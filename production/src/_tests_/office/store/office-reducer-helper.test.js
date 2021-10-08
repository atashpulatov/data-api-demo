import officeReducerHelper from '../../../office/store/office-reducer-helper';

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

  const reduxStoreMock = {
    getState: () => ({
      objectReducer: {
        objects: 'objectsTest',
      },
      operationReducer: {
        operations: 'operationsTest',
      },
    })
  };

  it('getObjectsListFromObjectReducer works as expected', () => {
    // given
    officeReducerHelper.init(reduxStoreMock);

    // when
    const result = officeReducerHelper.getObjectsListFromObjectReducer();

    // then
    expect(result).toEqual('objectsTest');
  });

  it('getOperationsListFromOperationReducer works as expected', () => {
    // given
    officeReducerHelper.init(reduxStoreMock);

    // when
    const result = officeReducerHelper.getOperationsListFromOperationReducer();

    // then
    expect(result).toEqual('operationsTest');
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
