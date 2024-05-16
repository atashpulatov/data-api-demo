import { authenticationHelper } from '../authentication/authentication-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';
import { FiltersText } from './object-filter-helper-types';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectInfoSetting } from '../redux-reducer/settings-reducer/settings-reducer-types';
import { ObjectData, ObjectDetails, Owner } from '../types/object-types';
import { MstrObjectTypes } from './mstr-object-types';

import mstrObjectEnum from './mstr-object-type-enum';
import { TableOperation } from '../error/constants';

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
  owner: Owner,
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
 * @param objectType - The type of the object.
 * @returns The calculated offset value.
 */
export const calculateOffsetForObjectInfoSettings = (
  objectInfoSettings: ObjectInfoSetting[],
  objectType: MstrObjectTypes
): number => {
  const isReport = objectType.name === mstrObjectEnum.mstrObjectType.report.name;

  let offset = 0;
  const defaultOffset = 3;
  const offsetForName = 2;
  const offsetForReportFilters = 9; // Reports have report filter, report limits and view filter

  for (const item of objectInfoSettings) {
    if (item.toggleChecked) {
      switch (item.key) {
        case 'name':
          offset += offsetForName;
          break;
        case 'filter':
          offset += isReport ? offsetForReportFilters : defaultOffset;
          break;
        case 'pageBy':
          offset += isReport ? defaultOffset : 0;
          break;
        default:
          offset += defaultOffset;
          break;
      }
    }
  }

  return offset;
};

/**
 * Determines the table operation and start cell based on the provided parameters.
 * @param options - The options object.
 * @param options.tableMoved - Indicates whether the table was moved.
 * @param options.tableChanged - Indicates whether the table was changed.
 * @param options.previousObjectDetailsSize - The previous size of the object details.
 * @param options.newObjectDetailsSize - The new size of the object details.
 * @param options.tableStartCell - The start cell of the table.
 * @returns - An object containing the operation and start cell.
 */
export const getTableOperationAndStartCell = ({
  tableMoved,
  tableChanged,
  previousObjectDetailsSize,
  newObjectDetailsSize,
  tableStartCell,
}: {
  tableMoved: boolean;
  tableChanged: boolean;
  previousObjectDetailsSize: number;
  newObjectDetailsSize: number;
  tableStartCell: string;
}): {
  operation: TableOperation;
  startCell: string;
} => {
  const [column, row] = tableStartCell.split(/(\d+)/);

  // when the table moved, if there is no place left for the object details above the table, the object details start from the first cell of the selected column.
  if (parseInt(row, 10) < newObjectDetailsSize && tableMoved) {
    return { startCell: `${column}1`, operation: TableOperation.CREATE_NEW_TABLE };
  }
  const objectDetailsSizeChanged = previousObjectDetailsSize !== newObjectDetailsSize;

  let startCell: string;

  if (!tableMoved && objectDetailsSizeChanged) {
    startCell = officeApiHelper.offsetCellBy(tableStartCell, -previousObjectDetailsSize, 0);
  } else {
    startCell = officeApiHelper.offsetCellBy(tableStartCell, -newObjectDetailsSize, 0);
  }

  // If the table changed (for example one of the columns are deleted), or the object details size changed when the table was not moved, a new table has to be created.
  // When the table is not moved but the object details size changed, the reference point is taken as the start cell of the object details, and the placement of the new table is made accordingly.
  const operation =
    tableChanged || (!tableMoved && objectDetailsSizeChanged)
      ? TableOperation.CREATE_NEW_TABLE
      : TableOperation.UPDATE_EXISTING_TABLE;

  return {
    operation,
    startCell,
  };
};
