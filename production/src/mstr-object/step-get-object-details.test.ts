import { mstrObjectRestService } from './mstr-object-rest-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, ObjectDetails } from '../types/object-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';
import * as objectDetailsMethods from './get-object-details-methods';
import stepGetObjectDetails from './step-get-object-details';

describe('StepGetObjectDetails', () => {
  const objectDataMock = {
    objectWorkingId: 1,
    objectId: 12,
    projectId: 123,
    mstrObjectType: 'sumType',
  } as unknown as ObjectData;
  const operationDataMock = {
    instanceDefinition: { instanceId: 2 },
  } as unknown as OperationData;
  const mockedReturn = {
    ancestors: { mockedProp: 'some ancestors' },
    certifiedInfo: { mockedProp: 'some certified info' },
    dateCreated: 'some date created',
    dateModified: 'some date modified',
    description: 'some description',
    owner: 'some owner',
    objectFilters: { viewFilter: undefined as any },
    version: "1.0",
    name: 'testName',
  };

  beforeAll(() => {
    jest.spyOn(mstrObjectRestService, 'getObjectInfo').mockImplementation(() => mockedReturn);
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation(() => jest.fn());
    jest
      .spyOn(operationStepDispatcher, 'completeGetObjectDetails')
      .mockImplementation(() => jest.fn());
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
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockResolvedValue([]);
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
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockResolvedValue([]);
    jest
      .spyOn(objectDetailsMethods, 'populateDetails')
      .mockImplementation(() => ({}) as ObjectDetails);

    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(objectDetailsMethods.populateDetails).toBeCalled();
    expect(objectDetailsMethods.populateDetails).toBeCalledWith(
      mockedReturn.ancestors,
      mockedReturn.certifiedInfo,
      mockedReturn.dateCreated,
      mockedReturn.dateModified,
      mockedReturn.description,
      mockedReturn.objectFilters,
      mockedReturn.owner,
      mockedReturn.version
    );
  });

  it('should call populateDefinition', async () => {
    // given
    const mockedPromptsAnswer = ['some prompts'];
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockResolvedValue(mockedPromptsAnswer);
    jest
      .spyOn(objectDetailsMethods, 'populateDetails')
      .mockImplementation(() => ({}) as ObjectDetails);
    jest
      .spyOn(objectDetailsMethods, 'populateDefinition')
      .mockImplementation(() => ({}) as ObjectData & { sourceName: string });

    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(objectDetailsMethods.populateDefinition).toBeCalled();
    expect(objectDetailsMethods.populateDefinition).toBeCalledWith(
      objectDataMock,
      mockedPromptsAnswer,
      'testName'
    );
  });

  it('should combine objectData with details if no prompts present and call updateObject', async () => {
    // given
    const mockedDetailsReturn = { someProp: 'some data' };
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockResolvedValue([]);
    jest
      .spyOn(objectDetailsMethods, 'populateDetails')
      .mockImplementation(() => mockedDetailsReturn as unknown as ObjectDetails);
    jest
      .spyOn(objectDetailsMethods, 'populateDefinition')
      .mockImplementation(() => ({}) as ObjectData & { sourceName: string });
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(operationStepDispatcher.updateObject).toBeCalled();
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      definition: {},
      ...objectDataMock,
      details: mockedDetailsReturn,
    });
  });

  it('should combine objectData with definition and details', async () => {
    // given
    const mockedDetailsReturn = { someProp: 'some data' };
    const mockedPopulateDefinitionReturn = {
      someOtherProp: 'some data from prop',
    };
    jest.spyOn(objectDetailsMethods, 'getObjectPrompts').mockResolvedValue([]);
    jest
      .spyOn(objectDetailsMethods, 'populateDetails')
      .mockImplementation(() => mockedDetailsReturn as unknown as ObjectDetails);
    jest
      .spyOn(objectDetailsMethods, 'populateDefinition')
      .mockImplementation(
        () => mockedPopulateDefinitionReturn as unknown as ObjectData & { sourceName: string }
      );
    // when
    await stepGetObjectDetails.getObjectDetails(objectDataMock, operationDataMock);
    // then
    expect(operationStepDispatcher.updateObject).toBeCalled();
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      ...objectDataMock,
      details: mockedDetailsReturn,
      definition: mockedPopulateDefinitionReturn,
    });
  });
});
