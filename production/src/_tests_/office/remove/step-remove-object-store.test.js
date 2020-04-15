import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepRemoveObjectStore from '../../../office/remove/step-remove-object-store';
import officeStoreObject from '../../../office/store/office-store-object';
import operationErrorHandler from '../../../operation/operation-error-handler';

describe('StepRemoveObjectStore', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stepRemoveObjectStore should handle exception', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeStoreObject, 'removeObjectFromStore').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepRemoveObjectStore.removeObjectStore({}, {});

    // then
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith({}, {}, new Error('errorTest'));
  });

  it('stepRemoveObjectStore should work as expected', async () => {
    // given
    jest.spyOn(officeStoreObject, 'removeObjectFromStore').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectStore').mockImplementation();

    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
    };

    // when
    await stepRemoveObjectStore.removeObjectStore(objectData, {});

    // then
    expect(officeStoreObject.removeObjectFromStore).toBeCalledTimes(1);
    expect(officeStoreObject.removeObjectFromStore).toBeCalledWith('objectWorkingIdTest');

    expect(operationStepDispatcher.completeRemoveObjectStore).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectStore).toBeCalledWith('objectWorkingIdTest');
  });
});
