import { officeApiHelper } from '../api/office-api-helper';

import officeStoreObject from '../store/office-store-object';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepRemoveObjectBinding from './step-remove-object-binding';

const officeContextMock = {
  document: {
    bindings: {
      releaseByIdAsync: undefined,
    },
  },
};

describe('StepRemoveObjectBinding', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeObjectBinding should handle exception', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getOfficeContext').mockReturnValue(officeContextMock);

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectBinding').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(officeStoreObject, 'removeObjectInExcelStore').mockImplementation();

    officeContextMock.document.bindings.releaseByIdAsync = jest.fn().mockImplementation(() => {
      throw new Error('errorTest');
    });

    // when
    await stepRemoveObjectBinding.removeObjectBinding(
      { objectWorkingId: 'objectWorkingIdTest' },
      {}
    );

    // then
    expect(officeApiHelper.getOfficeContext).toBeCalledTimes(1);
    expect(officeApiHelper.getOfficeContext).toBeCalledWith();

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationStepDispatcher.completeRemoveObjectBinding).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectBinding).toBeCalledWith(
      'objectWorkingIdTest'
    );

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      doNotPersist: true,
    });

    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledTimes(1);
    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledWith('objectWorkingIdTest');
  });

  it('removeObjectBinding should work as expected', async () => {
    // given
    const releaseByIdAsyncMock = jest.fn();
    officeContextMock.document.bindings.releaseByIdAsync = releaseByIdAsyncMock;

    jest.spyOn(officeApiHelper, 'getOfficeContext').mockReturnValue(officeContextMock);

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectBinding').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(officeStoreObject, 'removeObjectInExcelStore').mockImplementation();

    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
    };

    // when
    await stepRemoveObjectBinding.removeObjectBinding(objectData, {});

    // then
    expect(officeApiHelper.getOfficeContext).toBeCalledTimes(1);
    expect(officeApiHelper.getOfficeContext).toBeCalledWith();

    expect(releaseByIdAsyncMock).toBeCalledTimes(1);
    expect(releaseByIdAsyncMock).toBeCalledWith('bindIdTest');

    expect(operationStepDispatcher.completeRemoveObjectBinding).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectBinding).toBeCalledWith(
      'objectWorkingIdTest'
    );

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      doNotPersist: true,
    });

    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledTimes(1);
    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledWith('objectWorkingIdTest');
  });
});
