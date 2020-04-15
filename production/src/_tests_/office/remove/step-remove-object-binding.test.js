import stepRemoveObjectBinding from '../../../office/remove/step-remove-object-binding';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('StepRemoveObjectBinding', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeObjectBinding should work as expected', async () => {
    // given
    const releaseByIdAsyncMock = jest.fn();

    /* eslint-disable object-curly-newline */
    const officeContextMock = {
      document: {
        bindings: {
          releaseByIdAsync: releaseByIdAsyncMock,
        }
      }
    };
    /* eslint-enable object-curly-newline */

    const getOfficeContextMock = jest.spyOn(officeApiHelper, 'getOfficeContext').mockReturnValue(officeContextMock);

    const completeRemoveObjectBindingMock = jest.spyOn(
      operationStepDispatcher, 'completeRemoveObjectBinding'
    ).mockImplementation();

    const objectData = {
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
    };

    // when
    await stepRemoveObjectBinding.removeObjectBinding(objectData, {});

    // then
    expect(getOfficeContextMock).toBeCalledTimes(1);
    expect(getOfficeContextMock).toBeCalledWith();

    expect(releaseByIdAsyncMock).toBeCalledTimes(1);
    expect(releaseByIdAsyncMock).toBeCalledWith('bindIdTest');

    expect(completeRemoveObjectBindingMock).toBeCalledTimes(1);
    expect(completeRemoveObjectBindingMock).toBeCalledWith('objectWorkingIdTest');
  });
});
