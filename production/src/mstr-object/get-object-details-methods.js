import { authenticationHelper } from '../authentication/authentication-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';

import mstrObjectEnum from './mstr-object-type-enum';

const promptAnswerFunctionsMap = {
  OBJECTS: prompt => prompt.answers.map(answer => answer.name),
  LEVEL: prompt => prompt.answers.units.map(unit => unit.name),
  EXPRESSION: prompt => prompt.answers.content,
  ELEMENTS: prompt => prompt.answers.map(answer => answer.name),
  VALUE: prompt => prompt.answers,
};

export const getObjectPrompts = async (objectData, objectId, projectId, operationData) => {
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
  return unfilteredPrompts.map(prompt => promptAnswerFunctionsMap[prompt.type](prompt));
};

export const populateDefinition = (objectData, prompts, name) => ({
  ...objectData.definition,
  sourceName: name,
  ...(prompts ? { prompts } : {}),
});

export const populateDetails = (ancestors, certifiedInfo, dateModified, owner) => ({
  ancestors,
  certified: certifiedInfo,
  modifiedDate: dateModified,
  owner,
  importedBy: authenticationHelper.getCurrentMstrUserFullName(),
});
