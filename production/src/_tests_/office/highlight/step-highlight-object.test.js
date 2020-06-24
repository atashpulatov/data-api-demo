const { default: stepHighlightObject } = require('../../../office/highlight/step-highlight-object');
const { officeApiHelper } = require('../../../office/api/office-api-helper');
const { default: operationStepDispatcher } = require('../../../operation/operation-step-dispatcher');
const { default: operationErrorHandler } = require('../../../operation/operation-error-handler');

describe('StepHighlightObject', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('StepHighlightObject should highligh object', async () => {
    // given
    const objectData = { objectWorkingId: 1 };

    const mockedOnObjectClick = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation();
    const mockedCompleteStep = jest.spyOn(operationStepDispatcher, 'completeHighlightObject').mockImplementation();

    // when
    await stepHighlightObject.highlightObject(objectData);

    // then
    expect(mockedOnObjectClick).toBeCalledTimes(1);
    expect(mockedOnObjectClick).toBeCalledWith(objectData);
    expect(mockedCompleteStep).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledWith(objectData.objectWorkingId);
  });

  it('should handle error on highligh object', async () => {
    // given
    const objectData = { objectWorkingId: 1 };
    const operationData = {};
    const error = new Error('error');

    const mockedOnObjectClick = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => { throw error; });
    const mockedHandleError = jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepHighlightObject.highlightObject(objectData, operationData);

    // then
    expect(mockedOnObjectClick).toBeCalledTimes(1);
    expect(mockedOnObjectClick).toBeCalledWith(objectData);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData, error);
  });
});
