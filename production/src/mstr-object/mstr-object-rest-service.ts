import request from 'superagent';

import mstrAttributeFormHelper from './helper/mstr-attribute-form-helper';
import mstrAttributeMetricHelper from './helper/mstr-attribute-metric-helper';
import officeConverterServiceV2 from './office-converter-service-v2';

import { ReduxStore } from '../store';

import { InstanceDefinition } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { DossierData, TableDimensions, VisualizationInfo } from '../types/object-types';
import { MstrObjectTypes, VisualizationTypes } from './mstr-object-types';

import { OutsideOfRangeError } from '../error/outside-of-range-error';
import mstrObjectEnum from './mstr-object-type-enum';
import { ErrorMessages } from '../error/constants';
import { DisplayAttrFormNames } from './constants';

const reportObjectType = mstrObjectEnum.mstrObjectType.report;

const API_VERSION = 2;
const EXCEL_COLUMN_LIMIT = 16384;
const EXCEL_ROW_LIMIT = 1048576;
export const CONTEXT_LIMIT = 500; // Maximum number of Excel operations before context syncing.
export const DATA_LIMIT = 200000; // 200000 is around 1mb of MSTR JSON response
export const IMPORT_ROW_LIMIT = 20000; // Maximum number of rows to fetch during data import.
export const PROMISE_LIMIT = 10; // Number of concurrent excelContext.sync() promises during data import.

function checkTableDimensions({ rows, columns }: TableDimensions): TableDimensions {
  if (rows >= EXCEL_ROW_LIMIT || columns >= EXCEL_COLUMN_LIMIT) {
    throw new OutsideOfRangeError();
  }
  return { rows, columns };
}

function parseInstanceDefinition(response: any, attrforms: any): InstanceDefinition {
  const { body } = response;
  if (response.status === 200 && body.status === 2) {
    const { instanceId, status } = body;
    return { instanceId, status };
  }
  const { instanceId, data, definition, internal } = body;
  body.attrforms = attrforms;
  if (data.paging.total === 0) {
    throw new Error(ErrorMessages.NO_DATA_RETURNED);
  }
  const mstrTable = officeConverterServiceV2.createTable(body);
  const { rows, columns } = checkTableDimensions(mstrTable.tableSize);

  return {
    instanceId,
    rows,
    columns,
    mstrTable,
    data,
    definition,
    manipulationsXML: internal,
  };
}

function getFullPath({
  envUrl,
  limit,
  mstrObjectType,
  objectId,
  instanceId,
  version = 1,
  visualizationInfo = {},
}: {
  envUrl: string;
  limit?: number;
  mstrObjectType: MstrObjectTypes;
  objectId: string;
  instanceId?: string;
  version?: number;
  visualizationInfo?: VisualizationInfo;
}): string {
  let path;
  if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
    const { chapterKey, visualizationKey } = visualizationInfo;
    path = `${envUrl}/v2/dossiers/${objectId}/instances/${instanceId}/chapters/${chapterKey}/visualizations/${visualizationKey}`;
  } else {
    const api = version > 1 ? `v${version}/` : '';
    path = `${envUrl}/${api}${mstrObjectType.request}/${objectId}/instances`;
    path += instanceId ? `/${instanceId}` : '';
    path += limit ? `?limit=${limit}` : '';
  }
  return path;
}

/**
 * Returns fields query selector value based on type of the object
 *
 * @param visualizationType Specifies type of the visualisation
 * @returns fields query selector
 */
function getFetchObjectContentFields(visualizationType: VisualizationTypes): string {
  switch (visualizationType) {
    case VisualizationTypes.COMPOUND_GRID:
    case VisualizationTypes.MICROCHARTS:
      return `-data.metricValues.columnSets.extras,-data.metricValues.columnSets.formatted`;
    default:
      return `-data.metricValues.extras,-data.metricValues.formatted`;
  }
}

function fetchObjectContent(
  fullPath: string,
  authToken: string,
  projectId: string,
  visualizationType: VisualizationTypes,
  offset = 0,
  limit = -1
): any {
  if (limit > IMPORT_ROW_LIMIT || offset > EXCEL_ROW_LIMIT) {
    throw new Error(ErrorMessages.PROBLEM_WITH_REQUEST);
  }
  const contentFields = getFetchObjectContentFields(visualizationType);
  const validPath = encodeURI(
    `${fullPath}?offset=${offset}&limit=${limit}&fields=${contentFields}`
  );

  return request
    .get(validPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials();
}

/**
 * This function fetches the content of the object.
 * It is used to fetch the dossier or report in chunks to be inserted in workbook.
 * @param fullPath
 * @param authToken
 * @param projectId
 * @param offset
 * @param limit
 * @param visualizationType
 * @returns
 */
async function fetchContentPart(
  fullPath: string,
  authToken: string,
  projectId: string,
  offset: number,
  limit: number,
  visualizationType: VisualizationTypes
): Promise<any> {
  const { body: fetchedBody } = await fetchObjectContent(
    fullPath,
    authToken,
    projectId,
    visualizationType,
    offset,
    limit
  );
  if (!fetchedBody.data || !fetchedBody.data.paging) {
    throw new Error(ErrorMessages.NO_DATA_RETURNED);
  }
  return fetchedBody;
}

/**
 * This function offsets the subtotal row index by the offset value.
 * @param element
 * @param offset
 */
function offsetRowSubtotal(element: any, offset: number): void {
  if (element) {
    element.rowIndex += offset;
  }
}

/**
 * This function offsets the subtotal column index by the offset value.
 * @param element
 * @param offset
 */
function offsetCrosstabSubtotal(element: any, offset: number): void {
  if (element && element.axis === 'rows') {
    element.colIndex += offset;
  }
}

class MstrObjectRestService {
  reduxStore: ReduxStore;

  constructor() {
    this.fetchContentGenerator = this.fetchContentGenerator.bind(this);
  }

  init(reduxStore: ReduxStore): void {
    this.reduxStore = reduxStore;
  }

  // eslint-disable-next-line class-methods-use-this
  async *fetchContentGenerator({
    instanceDefinition,
    objectId,
    projectId,
    mstrObjectType,
    limit = IMPORT_ROW_LIMIT,
    visualizationInfo,
    displayAttrFormNames,
  }: {
    instanceDefinition: InstanceDefinition;
    objectId: string;
    projectId: string;
    mstrObjectType: any;
    dossierData: DossierData;
    limit: number;
    visualizationInfo: any;
    displayAttrFormNames: any;
  }): any {
    const {
      rows: totalRows,
      instanceId,
      mstrTable: { isCrosstab, visualizationType },
    } = instanceDefinition;

    const { envUrl, authToken } = this.reduxStore.getState().sessionReducer;
    const { supportForms } = this.reduxStore.getState().officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };

    let fetchedRows = 0;
    let offset = 0;
    const metricsInRows = [];
    const fullPath = getFullPath({
      envUrl,
      mstrObjectType,
      objectId,
      instanceId,
      version: API_VERSION,
      visualizationInfo,
    });

    // Declaring these functions outside of the loop to avoid creating them on each iteration
    // and mitigate eslint no-loop-func rule.
    const offsetRowSubtotalFn = (element: any): void => offsetRowSubtotal(element, offset);
    const offsetCrosstabSubtotalFn = (element: any): void =>
      offsetCrosstabSubtotal(element, offset);

    while (fetchedRows < totalRows && fetchedRows < EXCEL_ROW_LIMIT) {
      const fetchedBody = await fetchContentPart(
        fullPath,
        authToken,
        projectId,
        offset,
        limit,
        visualizationType
      );

      const body = officeConverterServiceV2.convertCellValuesToExcelStandard(fetchedBody);

      const { current } = body.data.paging;

      const metricsInRowsInfo = mstrAttributeMetricHelper.getMetricsInRowsInfo(
        body,
        metricsInRows,
        fetchedBody
      );

      metricsInRows.push(...metricsInRowsInfo.metricsInRows);

      fetchedRows = current + offset;
      body.attrforms = attrforms;
      const { row, rowTotals } = officeConverterServiceV2.getRows(body, isCrosstab);

      let header;
      let crosstabSubtotal;

      if (isCrosstab) {
        header = officeConverterServiceV2.getHeaders(body, isCrosstab);
        crosstabSubtotal = header.subtotalAddress;
        if (offset !== 0) {
          crosstabSubtotal.forEach(offsetCrosstabSubtotalFn); // Pass offset as a parameter
        }
      } else if (offset !== 0) {
        rowTotals.forEach(offsetRowSubtotalFn); // Pass offset as a parameter
      }
      offset += current;

      yield {
        row,
        header,
        subtotalAddress: isCrosstab ? crosstabSubtotal : rowTotals,
        metricsInRows,
        rowsInformation: mstrAttributeFormHelper.splitAttributeForms(
          metricsInRowsInfo.metricsRows,
          attrforms
        ),
      };
    }
  }

  answerDossierPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    ignoreValidateRequiredCheck = false,
  }: {
    objectId: string;
    projectId: string;
    instanceId: string;
    promptsAnswers: any;
    ignoreValidateRequiredCheck: boolean;
  }): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/promptsAnswers${ignoreValidateRequiredCheck ? '?ignoreValidateRequiredCheck=true' : ''}`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then(res => res.status);
  };

  answerPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    ignoreValidateRequiredCheck = false,
  }: {
    objectId: string;
    projectId: string;
    instanceId: string;
    promptsAnswers: any;
    ignoreValidateRequiredCheck?: boolean;
  }): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/reports/${objectId}/instances/${instanceId}/promptsAnswers${ignoreValidateRequiredCheck ? '?ignoreValidateRequiredCheck=true' : ''}`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then(res => res.status);
  };

  createDossierBasedOnReport = (
    chosenObjectId: string,
    instanceId: string,
    projectId: string
  ): any => {
    // TODO: get rid of the getState
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/dossiers/instances`;
    const body = {
      objects: [
        {
          type: 3,
          id: chosenObjectId,
          newName: 'Temp Dossier',
        },
      ],
      linkingInfo: {
        sourceInstanceId: instanceId,
        selectorMode: 'NONE',
      },
    };

    return request
      .post(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then(res => res.body);
  };

  createInstance = async ({
    objectId,
    projectId,
    mstrObjectType = reportObjectType,
    body = {},
    limit = 1,
    displayAttrFormNames,
  }: {
    objectId: string;
    projectId: string;
    mstrObjectType: MstrObjectTypes;
    dossierData: DossierData;
    body: any;
    limit: number;
    displayAttrFormNames: DisplayAttrFormNames;
  }): Promise<InstanceDefinition> => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const fullPath = getFullPath({
      envUrl,
      limit,
      mstrObjectType,
      objectId,
      version: API_VERSION,
    });

    return request
      .post(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then(res => parseInstanceDefinition(res, attrforms));
  };

  fetchVisualizationDefinition = ({
    projectId,
    objectId,
    instanceId,
    visualizationInfo,
    body,
    displayAttrFormNames,
  }: {
    projectId: string;
    objectId: string;
    instanceId: string;
    visualizationInfo: VisualizationInfo;
    body: any;
    displayAttrFormNames: DisplayAttrFormNames;
  }): Promise<InstanceDefinition> => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const { chapterKey, visualizationKey } = visualizationInfo;
    const fullPath = `${envUrl}/v2/dossiers/${objectId}/instances/${instanceId}/chapters/${chapterKey}/visualizations/${visualizationKey}?limit=1&contentFlags=768`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body || '')
      .withCredentials()
      .then(res => parseInstanceDefinition(res, attrforms));
  };

  createDossierInstance = (projectId: string, objectId: string, body: any = {}): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/dossiers/${objectId}/instances`;
    return request
      .post(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then(res => res.body);
  };

  getDossierInstanceDefinition = (
    projectId: string,
    objectId: string,
    dossierInstanceId: string
  ): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/v2/dossiers/${objectId}/instances/${dossierInstanceId}/definition`;
    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  deleteDossierInstance = (projectId: string, objectId: string, instanceId: string): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}`;
    return request
      .delete(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  getDossierStatus = (dossierId: string, instanceId: string, projectId: string): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${dossierId}/instances/${instanceId}/status`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res);
  };

  getInstance = ({
    objectId,
    projectId,
    mstrObjectType = reportObjectType,
    body = {},
    instanceId,
    displayAttrFormNames,
  }: {
    objectId: string;
    projectId: string;
    mstrObjectType: MstrObjectTypes;
    dossierData: DossierData;
    body: any;
    instanceId: string;
    displayAttrFormNames: DisplayAttrFormNames;
  }): Promise<InstanceDefinition> => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const fullPath = getFullPath({
      envUrl,
      mstrObjectType,
      objectId,
      instanceId,
      limit: 1,
      version: API_VERSION,
    });

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then(res => parseInstanceDefinition(res, attrforms));
  };

  modifyInstance = ({
    objectId,
    projectId,
    mstrObjectType = reportObjectType,
    body = {},
    instanceId,
    displayAttrFormNames,
  }: {
    objectId: string;
    projectId: string;
    mstrObjectType?: MstrObjectTypes;
    body: any;
    instanceId: string;
    displayAttrFormNames: DisplayAttrFormNames;
  }): Promise<InstanceDefinition> => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const fullPath = getFullPath({
      envUrl,
      limit: 1,
      mstrObjectType,
      objectId,
      instanceId,
      version: API_VERSION,
    });

    return request
      .put(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then(res => parseInstanceDefinition(res, attrforms));
  };

  getObjectDefinition = (
    objectId: string,
    projectId: string,
    mstrObjectType: MstrObjectTypes = reportObjectType
  ): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const api = API_VERSION > 1 ? 'v2/' : '';
    const fullPath = `${envUrl}/${api}${mstrObjectType.request}/${objectId}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  getObjectInfo = (
    objectId: string,
    projectId: string,
    mstrObjectType: MstrObjectTypes = reportObjectType
  ): any => {
    const storeState = this.reduxStore.getState();
    // visualisation does not have object type, all other objects has type represented by number
    // If we pass not a number we know its visualisation and we set type as 55 (document)
    if (typeof mstrObjectType.type !== 'number') {
      // @ts-expect-error
      mstrObjectType.type = 55;
    }
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/objects/${objectId}?type=${mstrObjectType.type}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  /**
   * Gets the prompts applied to the object's instance.
   *
   * @param objectId Id of an object
   * @param projectId Id of a project
   * @param instanceId Id of an instance
   * @param includeClosedPrompts Whether to request to include closed prompts
   */
  getObjectPrompts = (
    objectId: string,
    projectId: string,
    instanceId: string,
    includeClosedPrompts = false
  ): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts${includeClosedPrompts ? '?closed=true' : ''}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  isPrompted = (objectId: string, projectId: string, objectTypeName: string): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;

    let typePath;
    if (objectTypeName === mstrObjectEnum.mstrObjectType.report.name) {
      typePath = 'reports';
    } else if (objectTypeName === mstrObjectEnum.mstrObjectType.dossier.name) {
      typePath = 'documents';
    }
    const fullPath = `${envUrl}/${typePath}/${objectId}/prompts`;
    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .withCredentials()
      .then(res => ({
        // Create JSON object with promptObjects and isPrompted properties, and return it.
        // isPrompted is true if report or dossier has prompts to be answered.
        // If report or dossier has prompts, promptObjects contains an array of
        // prompt objects defined in report/dossier.
        promptObjects: res.body,
        isPrompted: res.body && res.body.length > 0,
      }));
  };

  /**
   * Function getting information about a cube from a certain project.
   *
   * @param objectId
   * @param projectId
   * @returns Contains info for cube that match objectId and projectId
   */
  getCubeInfo = (objectId: string, projectId: string): any =>
    new Promise((resolve, reject) => {
      const storeState = this.reduxStore.getState();
      const { envUrl, authToken } = storeState.sessionReducer;
      const fullPath = `${envUrl}/cubes?id=${objectId}`;
      // eslint-disable-next-line no-promise-executor-return
      return request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('X-MSTR-ProjectID', projectId)
        .withCredentials()
        .then(res => resolve(res.body.cubesInfos[0]))
        .catch(error => reject(error));
    });

  rePromptDossier = (dossierId: string, instanceId: string, projectId: string): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${dossierId}/instances/${instanceId}/rePrompt`;

    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  /**
   * Answer specified prompts on the document/dossier instance,
   * prompts can either be answered with default answers(if available)
   * @param  param0
   * @returns
   */
  updateDossierPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    ignoreValidateRequiredCheck = false,
  }: {
    objectId: string;
    projectId: string;
    instanceId: string;
    promptsAnswers: any;
    ignoreValidateRequiredCheck: boolean;
  }): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts/answers${ignoreValidateRequiredCheck ? '?ignoreValidateRequiredCheck=true' : ''}`;
    return request
      .put(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send({ prompts: promptsAnswers.answers })
      .withCredentials()
      .then(res => res.status);
  };

  updateReportPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    ignoreValidateRequiredCheck = false,
  }: {
    objectId: string;
    projectId: string;
    instanceId: string;
    promptsAnswers: any;
    ignoreValidateRequiredCheck: boolean;
  }): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/reports/${objectId}/instances/${instanceId}/prompts/answers${ignoreValidateRequiredCheck ? '?ignoreValidateRequiredCheck=true' : ''}`;
    return request
      .put(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send({ prompts: promptsAnswers })
      .withCredentials()
      .then(res => res.status);
  };

  applyDossierPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    ignoreValidateRequiredCheck = false,
  }: {
    objectId: string;
    projectId: string;
    instanceId: string;
    promptsAnswers: any;
    ignoreValidateRequiredCheck: boolean;
  }): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/dossiers/${objectId}/instances/${instanceId}/answerPrompts${ignoreValidateRequiredCheck ? '?ignoreValidateRequiredCheck=true' : ''}`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then(res => res.status);
  };

  /**
   * This method is used to fetch attribute's elements list for a given prompt defined in a dossier's instance
   *
   * @param objectId
   * @param projectId
   * @param instanceId
   * @param promptId
   * @returns Promise object represents the list of attribute's elements
   */
  getPromptElements = (
    objectId: string,
    projectId: string,
    instanceId: string,
    promptId: string
  ): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts/${promptId}/elements`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  /**
   * This method fetches the list of objects elements for a given prompt defined in a dossier's instance
   *
   * @param objectId
   * @param projectId
   * @param instanceId
   * @param promptId
   * @returns array of objects elements
   */
  getPromptObjectElements = (
    objectId: string,
    projectId: string,
    instanceId: string,
    promptId: string
  ): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts/${promptId}/objects`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  /**
   * This method fetches the visualization image as a ReadableStream
   * for a given visualization key.
   *
   * @param {string} zobjectId
   * @param {string} projectId
   * @param {string} instanceId
   * @param {string} visualizationKey
   * @param {string} dimensions
   *
   * @returns array of objects elements
   */
  getVisualizationImage = async (
    objectId: string,
    projectId: string,
    instanceId: string,
    visualizationKey: string,
    dimensions: { width: number; height: number }
  ): Promise<any> => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/visualizations/${visualizationKey}/image`;
    const { width, height } = dimensions;
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(projectId && { 'x-mstr-projectId': projectId }),
        ...(authToken && { 'X-MSTR-AuthToken': authToken }),
      },
      body: JSON.stringify({ width, height }),
    };

    // @ts-expect-error
    const response = await fetch(fullPath, options);
    if (!response.ok) {
      const responseBody = await response.json();
      const restError = new Error(responseBody.message);
      // @ts-expect-error
      restError.response = { body: responseBody };
      // @ts-expect-error
      restError.status = response.status;
      throw restError;
    }

    return response;
  };

  /**
   * Fetches information about Page-by elements of given Report instance
   *
   * @param reportId unique identifier of the mstr report
   * @param projectId unique identifier of the mstr project
   * @param instanceId unique identifier of the Report instance
   * @returns object containing Page-by elements and valid Page-by combinations
   */
  getPageByElements = (reportId: string, projectId: string, instanceId: string): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/v2/reports/${reportId}/instances/${instanceId}/pageBy/elements`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  };

  /**
   * This method fetches the information about a report's definition
   * it can additionally return metricFilters which is needed for view filters
   * @param reportId unique identifier of the mstr report
   * @param projectId unique identifier of the mstr project
   * @returns object containing the report's definition which includes "information", "sourceType", "dataSource", "grid" and perhaps "advancedProperties" and "timezone" if exist
   */
  getReportDefinition = (reportId: string, projectId: string): any => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/model/reports/${reportId}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(res => res.body);
  }

  getWorksheetBinary = async (
    docId: string,
    dossierInstanceId: string,
    visualizationKey: string,
    projectId: string
  ): Promise<any> => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${docId}/instances/${dossierInstanceId}/excel`;

    const body = { pageOption: 'DEFAULT', pagePerSheet: false, keys: [visualizationKey] };

    const options = {
      method: 'POST',
      credentials: 'include' as RequestCredentials,
      headers: {
        ...(dossierInstanceId && { 'X-MSTR-MS-Instance': dossierInstanceId }),
        Accept: 'application/octet-stream',
        'Content-type': 'application/json; charset=utf-8',
        ...(projectId && { 'x-mstr-projectId': projectId }),
        ...(authToken && { 'X-MSTR-AuthToken': authToken }),

      },
      body: JSON.stringify(body),
    };

    const response = await fetch(fullPath, options);
    return response;
  };
}

export const mstrObjectRestService = new MstrObjectRestService();
