import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import stepGetObjectDetails from '../../mstr-object/step-get-object-details';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import * as objectDetailsMethods from '../../mstr-object/get-object-details-methods';

describe('StepGetObjectDetails', () => {
  const objectDataMock = {
    objectWorkingId: 1,
    objectId: 12,
    projectId: 123,
    mstrObjectType: 'sumType',
  };
  const operationDataMock = {
    instanceDefinition: { instanceId: 2 } };
  const mockedReturn = {
    ancestors: { mockedProp: 'some ancestors' },
    certifiedInfo: { mockedProp: 'some certified info' },
    dateModified: { mockedProp: 'some date modified' },
    owner: { mockedProp: 'some owner' },
    name: 'testName',
  };

  beforeAll(() => {
    jest.spyOn(mstrObjectRestService, 'getObjectInfo').mockImplementation(() => mockedReturn);
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation(() => jest.fn());
    jest.spyOn(operationStepDispatcher, 'completeGetObjectDetails').mockImplementation(() => jest.fn());
  });

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('should call getObjectPrompts', async () => {
    // given
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockImplementation(() => {});
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(objectDetailsMethods.getObjectPrompts).toBeCalled();
    expect(objectDetailsMethods.getObjectPrompts).toBeCalledWith(
      objectDataMock,
      objectDataMock.objectId,
      objectDataMock.projectId,
      operationDataMock
    );
  });

  it('should call populateDetails', async () => {
    // given
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockImplementation(() => {});
    jest.spyOn(objectDetailsMethods, 'populateDetails').mockImplementation(() => {});
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(objectDetailsMethods.populateDetails).toBeCalled();
    expect(objectDetailsMethods.populateDetails).toBeCalledWith(
      mockedReturn.ancestors,
      mockedReturn.certifiedInfo,
      mockedReturn.dateModified,
      mockedReturn.owner,
    );
  });

  it('should call populateDefinition', async () => {
    // given
    const mockedPromptsAnswer = ['some prompts'];
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockImplementation(() => mockedPromptsAnswer);
    jest.spyOn(objectDetailsMethods, 'populateDetails').mockImplementation(() => {});
    jest.spyOn(objectDetailsMethods, 'populateDefinition').mockImplementation(() => {});
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(objectDetailsMethods.populateDefinition).toBeCalled();
    expect(objectDetailsMethods.populateDefinition).toBeCalledWith(objectDataMock, mockedPromptsAnswer, 'testName');
  });

  it('should combine objectData with details if no prompts present and call updateObject', async () => {
    // given
    const mockedDetailsReturn = { someProp: 'some data' };
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockImplementation(() => {});
    jest.spyOn(objectDetailsMethods, 'populateDetails').mockImplementation(() => mockedDetailsReturn);
    jest.spyOn(objectDetailsMethods, 'populateDefinition').mockImplementation(() => {});
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(operationStepDispatcher.updateObject).toBeCalled();
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ ...objectDataMock, details: mockedDetailsReturn });
  });


  it('should combine objectData with definition and details', async () => {
    // given
    const mockedDetailsReturn = { someProp: 'some data' };
    const mockedPopulateDefinitionReturn = { someOtherProp: 'some data from prop' };
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockImplementation(() => {});
    jest.spyOn(objectDetailsMethods, 'populateDetails').mockImplementation(() => mockedDetailsReturn);
    jest.spyOn(objectDetailsMethods, 'populateDefinition').mockImplementation(() => mockedPopulateDefinitionReturn);
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(operationStepDispatcher.updateObject).toBeCalled();
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      ...objectDataMock,
      details: mockedDetailsReturn,
      definition: mockedPopulateDefinitionReturn });
  });
});
