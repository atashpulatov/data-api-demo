import { authenticationHelper } from '../authentication/authentication-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, ObjectDetails } from '../types/object-types';

import mstrObjectEnum from './mstr-object-type-enum';

const promptAnswerFunctionsMap = {
  OBJECTS: (prompt: any) => prompt.answers.map((answer: any) => answer.name),
  LEVEL: (prompt: any) => prompt.answers.units.map((unit: any) => unit.name),
  EXPRESSION: (prompt: any) => prompt.answers.content,
  ELEMENTS: (prompt: any) => prompt.answers.map((answer: any) => answer.name),
  VALUE: (prompt: any) => prompt.answers,
};

export const getObjectPrompts = async (
  objectData: ObjectData,
  objectId: string,
  projectId: string,
  operationData: OperationData
): Promise<any[]> => {
  const { mstrObjectType, manipulationsXML, promptsAnswers } = objectData;
  if (
    mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name
      ? !manipulationsXML.promptAnswers
      : !promptsAnswers
  ) {
    return null;
  }
  const unfilteredPrompts = await mstrObjectRestService.getObjectPrompts(
    objectId,
    projectId,
    operationData.instanceDefinition.instanceId
  );
  // @ts-expect-error
  return unfilteredPrompts.map((prompt: any) => promptAnswerFunctionsMap[prompt.type](prompt));
};

export const populateDefinition = (
  objectData: ObjectData,
  prompts?: any,
  name?: string
): ObjectData => ({
  ...objectData.definition,
  sourceName: name,
  ...(prompts ? { prompts } : {}),
});

export const populateDetails = (
  ancestors: any,
  certifiedInfo: boolean,
  dateModified: string,
  owner: string
): ObjectDetails => ({
  ancestors,
  certified: certifiedInfo,
  modifiedDate: dateModified,
  owner,
  importedBy: authenticationHelper.getCurrentMstrUserFullName(),
});
