import { authenticationHelper } from '../authentication/authentication-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';
import { FiltersText } from './object-filter-helper-types';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectInfoSetting } from '../redux-reducer/settings-reducer/settings-reducer-types';
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
      : !promptsAnswers?.length
  ) {
    return [];
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
  ...(prompts?.length ? { prompts } : {}),
});

export const populateDetails = (
  ancestors: any,
  certifiedInfo: boolean,
  createdDate: string,
  modifiedDate: string,
  description: string,
  filters: FiltersText,
  owner: string,
  version: string
): ObjectDetails => ({
  ancestors,
  certified: certifiedInfo,
  createdDate,
  description,
  importedBy: authenticationHelper.getCurrentMstrUserFullName(),
  modifiedDate,
  filters,
  owner,
  version,
});

/**
 * Calculates the offset value for object details information based on the provided objectInfoSettings.
 * Object details information is placed above the table.
 * @param objectInfoSettings - An array of ObjectInfoSetting objects.
 * @returns The calculated offset value.
 */
export const calculateOffsetForObjectInfoSettings = (
  objectInfoSettings: ObjectInfoSetting[]
): number => {
  let offset = 0;
  // TODO: receive object type and determine spaces accordingly
  const defaultOffset = 3;
  const offsetForFilter = 9;
  const offsetForName = 2;

  for (const item of objectInfoSettings) {
    if (item.toggleChecked) {
      switch (item.key) {
        case 'name':
          offset += offsetForName;
          break;
        case 'filter':
          offset += offsetForFilter;
          break;
        default:
          offset += defaultOffset;
          break;
      }
    }
  }

  return offset;
};
