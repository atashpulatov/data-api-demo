import { mstrObjectRestService } from './mstr-object-rest-service';
import { authenticationHelper } from '../authentication/authentication-helper';

export const getObjectPrompts = async (objectData, objectId, projectId, operationData) => {
  if (objectData.promptsAnswers) {
    const unfilteredPrompts = await mstrObjectRestService
      .getObjectPrompts(objectId, projectId, operationData.instanceDefinition.instanceId);
    return unfilteredPrompts.map((prompt) => promptAnswerFunctionsMap[prompt.type](prompt));
  }
};

const promptAnswerFunctionsMap = {
  OBJECTS: (prompt) => prompt.answers.map(answer => answer.name),
  LEVEL: (prompt) => prompt.answers.units.map(unit => unit.name),
  EXPRESSION: (prompt) => prompt.answers.content,
  ELEMENTS: (prompt) => prompt.answers.map(answer => answer.name),
  VALUE: (prompt) => prompt.answers,
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
