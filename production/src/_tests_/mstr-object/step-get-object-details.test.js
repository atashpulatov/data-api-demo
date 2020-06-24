import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import stepGetObjectDetails from '../../mstr-object/step-get-object-details';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

describe('StepGetObjectDetails', () => {
  const objectDataMock = {
    objectWorkingId: 1,
    objectId: 12,
    projectId: 123,
    mstrObjectType: 'sumType',
  };
  const operationDataMock = {
    instanceDefinition: { instanceId: 2 } };

  beforeAll(() => {
    const mockedReturn = {
      ancestors: {}, certifiedInfo: {}, dateModified: {}, owner: {},
    };
    jest.spyOn(mstrObjectRestService, 'getObjectInfo').mockImplementation(() => mockedReturn);
    jest.spyOn(mstrObjectRestService, 'getObjectPrompts').mockImplementation(() => jest.fn());
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation(() => jest.fn());
    jest.spyOn(operationStepDispatcher, 'completeGetObjectDetails').mockImplementation(() => jest.fn());
  });
  it('should call mstrObjectRestService.getObjectInfo', async () => {
    // given
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(mstrObjectRestService.getObjectInfo).toBeCalled();
    expect(mstrObjectRestService.getObjectInfo).toBeCalledWith(
      objectDataMock.objectId,
      objectDataMock.projectId,
      objectDataMock.mstrObjectType
    );
  });
  it('should call mstrObjectRestService.getPromptsInfo if there are prompts', async () => {
    // given
    const mockedPromptsAnswers = 'some answers';
    // when
    await stepGetObjectDetails.getObjectDetails({ ...objectDataMock, promptsAnswers: mockedPromptsAnswers }, operationDataMock);
    // then
    expect(mstrObjectRestService.getObjectPrompts).toBeCalled();
    expect(mstrObjectRestService.getObjectPrompts).toBeCalledWith(
      objectDataMock.objectId,
      objectDataMock.projectId,
      operationDataMock.instanceDefinition.instanceId
    );
  });
});
