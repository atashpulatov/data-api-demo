import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepRemoveObjectStore from '../../../office/remove/step-remove-object-store';
import officeStoreObject from '../../../office/store/office-store-object';

describe('StepRemoveObjectStore', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stepRemoveObjectStore should work as expected', async () => {
    // given
    const removeObjectFromStoreMock = jest.spyOn(officeStoreObject, 'removeObjectFromStore').mockImplementation();

    const completeRemoveObjectStoreMock = jest.spyOn(
      operationStepDispatcher, 'completeRemoveObjectStore'
    ).mockImplementation();

    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
    };

    // when
    await stepRemoveObjectStore.removeObjectStore(objectData, {});

    // then
    expect(removeObjectFromStoreMock).toBeCalledTimes(1);
    expect(removeObjectFromStoreMock).toBeCalledWith('objectWorkingIdTest');

    expect(completeRemoveObjectStoreMock).toBeCalledTimes(1);
    expect(completeRemoveObjectStoreMock).toBeCalledWith('objectWorkingIdTest');
  });
});
