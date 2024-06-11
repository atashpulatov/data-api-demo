import officeReducerHelper from './office-reducer-helper';

import { reduxStore } from '../../store';

import { OperationTypes } from '../../operation/operation-type-names';
import { ObjectImportType } from '../../mstr-object/constants';

const mockObjects = [
  { importType: ObjectImportType.TABLE },
  { importType: ObjectImportType.IMAGE },
];
const reduxStoreMock = {
  objectReducer: {
    objects: mockObjects,
  },
  operationReducer: {
    operations: [
      { operationType: OperationTypes.HIGHLIGHT_OPERATION, objectWorkingId: 42 },
      { operationType: OperationTypes.REFRESH_OPERATION, objectWorkingId: 69 },
    ],
  },
  officeReducer: {
    isShapeAPISupported: true,
  },
};

describe('OfficeReducerHelper', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('getObjectsListFromObjectReducer works as expected', () => {
    // given
    // @ts-expect-error
    jest.spyOn(reduxStore, 'getState').mockReturnValue(reduxStoreMock);
    // when
    const result = officeReducerHelper.getObjectsListFromObjectReducer();

    // then
    expect(result).toEqual(mockObjects);
  });

  it('getOperationsListFromOperationReducer works as expected', () => {
    // given
    // @ts-expect-error
    jest.spyOn(reduxStore, 'getState').mockReturnValue(reduxStoreMock);

    const expectedOperations = [
      { operationType: OperationTypes.REFRESH_OPERATION, objectWorkingId: 69 },
    ];

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
  `(
    'noOperationInProgress works as expected',
    ({ expectedNoOperationInProgress, operationsListParam }) => {
      // given
      jest
        .spyOn(officeReducerHelper, 'getOperationsListFromOperationReducer')
        .mockReturnValue(operationsListParam);

      // when
      const result = officeReducerHelper.noOperationInProgress();

      // then
      expect(officeReducerHelper.getOperationsListFromOperationReducer).toBeCalledTimes(1);

      expect(result).toEqual(expectedNoOperationInProgress);
    }
  );

  it('clearPopupData should dispatch proper Redux action', () => {
    // given
    reduxStore.dispatch = jest.fn();

    // when
    officeReducerHelper.clearPopupData();

    // then
    expect(reduxStore.dispatch).toHaveBeenCalledTimes(1);
    expect(reduxStore.dispatch).toHaveBeenCalledWith({
      type: 'OFFICE_SET_POPUP_DATA',
    });
  });
});

describe('OfficeReducerHelper getObjectFromObjectReducerByBindId', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    expectedObject    | bindIdParam | objectsParam
    ${undefined}      | ${42}       | ${[]}
    ${undefined}      | ${42}       | ${[{ bindId: 4242 }]}
    ${{ bindId: 42 }} | ${42}       | ${[{ bindId: 42 }]}
    ${{ bindId: 42 }} | ${42}       | ${[{ bindId: 4242 }, { bindId: 42 }]}
  `(
    'getObjectFromObjectReducer works as expected',
    ({ expectedObject, bindIdParam, objectsParam }) => {
      // given
      // @ts-expect-error
      jest.spyOn(reduxStore, 'getState').mockReturnValue({
        objectReducer: {
          objects: objectsParam,
        },
      });

      // when
      const result = officeReducerHelper.getObjectFromObjectReducerByBindId(bindIdParam);

      // then
      expect(result).toEqual(expectedObject);
    }
  );
});
