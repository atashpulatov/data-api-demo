import stepRemoveObjectBinding from '../../../office/remove/step-remove-object-binding';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

const officeContextMock = {
  document: {
    bindings: {
      releaseByIdAsync: undefined,
    }
  }
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

    officeContextMock.document.bindings.releaseByIdAsync = jest.fn().mockImplementation(() => {
      throw new Error('errorTest');
    });

    // when
    await stepRemoveObjectBinding.removeObjectBinding({ objectWorkingId: 'objectWorkingIdTest' }, {});

    // then
    expect(officeApiHelper.getOfficeContext).toBeCalledTimes(1);
    expect(officeApiHelper.getOfficeContext).toBeCalledWith();

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationStepDispatcher.completeRemoveObjectBinding).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveObjectBinding).toBeCalledWith('objectWorkingIdTest');
  });

  it('removeObjectBinding should work as expected', async () => {
    // given
    const releaseByIdAsyncMock = jest.fn();
    officeContextMock.document.bindings.releaseByIdAsync = releaseByIdAsyncMock;

    jest.spyOn(officeApiHelper, 'getOfficeContext').mockReturnValue(officeContextMock);

    jest.spyOn(operationStepDispatcher, 'completeRemoveObjectBinding').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

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
    expect(operationStepDispatcher.completeRemoveObjectBinding).toBeCalledWith('objectWorkingIdTest');

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith(
      { objectWorkingId: 'objectWorkingIdTest', doNotPersist: true }
    );
  });
});
