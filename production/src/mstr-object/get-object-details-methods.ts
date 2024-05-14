import { authenticationHelper } from '../authentication/authentication-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import { mstrObjectRestService } from './mstr-object-rest-service';
import { FiltersText } from './object-filter-helper-types';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectInfoSetting } from '../redux-reducer/settings-reducer/settings-reducer-types';
import { ObjectData, ObjectDetails, Owner } from '../types/object-types';
import { MstrObjectTypes } from './mstr-object-types';

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

// TEMPORARY DOCS - SOME OF THE PARAMETERS CAN BE CALCULATED IN THE FUNCTION
/**
 * Retrieves the table status based on various conditions.
 * @param {boolean} tableMoved - Indicates whether the table has been moved.
 * @param {boolean} tableChanged - Indicates whether the table has been changed. (for example, the table columns have been deleted)
 * @param {boolean} objectDetailsSizeChanged - Indicates whether the object details size has changed.
 * @param {number} previousObjectDetailsSize - The previous object details size.
 * @param {number} newObjectDetailsSize - The new object details size.
 * @param {string} startCell - The start cell of the table.
 * @param {string} tableOuterCell - The outer cell of the table.
 * @returns {object} - An object containing the table status.
 * @property {string} value - Temporarily used during the development
 * @property {string} operation - The operation to be performed.
 * @property {string} [startCell] - The start cell of the table.
 * @property {string} [objectDetailsStartCell] - The start cell of the object details.
 */
export const getTableStatus = ({
  tableMoved,
  tableChanged,
  previousObjectDetailsSize,
  newObjectDetailsSize,
  tableOuterCell,
}: {
  tableMoved: boolean;
  tableChanged: boolean;
  previousObjectDetailsSize: number;
  newObjectDetailsSize: number;
  startCell: string;
  tableOuterCell: string;
}): {
  // temporary value used during development
  value: string;
  operation: 'createNewTable' | 'updateExistingTable';
  startCell?: string;
  objectDetailsStartCell?: string;
} => {
  const objectDetailsSizeChanged = previousObjectDetailsSize !== newObjectDetailsSize;
  if (!tableChanged) {
    console.log('table not changed');
    if (tableMoved && objectDetailsSizeChanged) {
      const newObjectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -newObjectDetailsSize,
        0
      );
      return {
        value: '11',
        operation: 'updateExistingTable',
        objectDetailsStartCell: newObjectDetailsStartCell,
      };
    }
    if (tableMoved && !objectDetailsSizeChanged) {
      const newObjectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -newObjectDetailsSize, // === previousObjectDetailsSize
        0
      );
      return {
        value: '10',
        operation: 'updateExistingTable',
        objectDetailsStartCell: newObjectDetailsStartCell,
      };
    }
    if (!tableMoved && !objectDetailsSizeChanged) {
      const objectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -newObjectDetailsSize, // === previousObjectDetailsSize
        0
      );
      return {
        value: '00',
        operation: 'updateExistingTable',
        objectDetailsStartCell,
      };
    }
    if (!tableMoved && objectDetailsSizeChanged) {
      const previousObjectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -previousObjectDetailsSize,
        0
      );
      return {
        value: '01',
        operation: 'createNewTable',
        startCell: previousObjectDetailsStartCell,
      };
    }
  }
  if (tableChanged) {
    console.log('table  changed');
    if (tableMoved && objectDetailsSizeChanged) {
      const newObjectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -newObjectDetailsSize,
        0
      );
      return {
        operation: 'createNewTable',
        value: '11',
        startCell: newObjectDetailsStartCell,
      };
    }
    if (tableMoved && !objectDetailsSizeChanged) {
      const previousObjectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -previousObjectDetailsSize, // === newObjectDetailsSize
        0
      );
      return {
        operation: 'createNewTable',
        value: '10',
        startCell: previousObjectDetailsStartCell,
      };
    }
    if (!tableMoved && objectDetailsSizeChanged) {
      const previousObjectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -previousObjectDetailsSize,
        0
      );
      return {
        value: '01',
        operation: 'createNewTable',
        startCell: previousObjectDetailsStartCell,
      };
    }
    if (!tableMoved && !objectDetailsSizeChanged) {
      const objectDetailsStartCell = officeApiHelper.offsetCellBy(
        tableOuterCell,
        -newObjectDetailsSize, // === previousObjectDetailsSize
        0
      );
      return {
        value: '00',
        operation: 'createNewTable',
        startCell: objectDetailsStartCell,
      };
    }
  }

  throw new Error('Invalid table status');
};
