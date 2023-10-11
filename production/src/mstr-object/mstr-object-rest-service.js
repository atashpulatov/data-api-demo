import request from 'superagent';
import { errorMessages } from '../error/constants';
import { OutsideOfRangeError } from '../error/outside-of-range-error';
import officeConverterServiceV2 from '../office/office-converter-service-v2';
import mstrObjectEnum from './mstr-object-type-enum';
import mstrAttributeFormHelper from './helper/mstr-attribute-form-helper';
import mstrAttributeMetricHelper from './helper/mstr-attribute-metric-helper';

const reportObjectType = mstrObjectEnum.mstrObjectType.report;

const API_VERSION = 2;
const EXCEL_COLUMN_LIMIT = 16384;
const EXCEL_ROW_LIMIT = 1048576;
export const CONTEXT_LIMIT = 500; // Maximum number of Excel operations before context syncing.
export const DATA_LIMIT = 200000; // 200000 is around 1mb of MSTR JSON response
export const IMPORT_ROW_LIMIT = 20000; // Maximum number of rows to fetch during data import.
export const PROMISE_LIMIT = 10; // Number of concurrent excelContext.sync() promises during data import.

function checkTableDimensions({ rows, columns }) {
  if (rows >= EXCEL_ROW_LIMIT || columns >= EXCEL_COLUMN_LIMIT) {
    throw new OutsideOfRangeError();
  }
  return { rows, columns };
}

function parseInstanceDefinition(res, attrforms) {
  const { body } = res;
  if (res.status === 200 && body.status === 2) {
    const { instanceId, status } = body;
    return { instanceId, status };
  }
  const { instanceId, data, internal } = body;
  body.attrforms = attrforms;
  if (data.paging.total === 0) { throw new Error(errorMessages.NO_DATA_RETURNED); }
  const mstrTable = officeConverterServiceV2.createTable(body);
  const { rows, columns } = checkTableDimensions(mstrTable.tableSize);

  return {
    instanceId,
    rows,
    columns,
    mstrTable,
    manipulationsXML: internal,
  };
}

function getFullPath({
  envUrl, limit, mstrObjectType, objectId, instanceId, version = 1, visualizationInfo = false,
}) {
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

function fetchObjectContent(fullPath, authToken, projectId, offset = 0, limit = -1, visualizationType) {
  if (limit > IMPORT_ROW_LIMIT || offset > EXCEL_ROW_LIMIT) {
    throw new Error(errorMessages.PROBLEM_WITH_REQUEST);
  }
  const contentFields = getFetchObjectContentFields(visualizationType);
  const validPath = encodeURI(`${fullPath}?offset=${offset}&limit=${limit}&fields=${contentFields}`);

  return request
    .get(validPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials();
}

/**
 * Returns fields query selector value based on type of the object
 *
 * @param {string} visualizationType Specifies type of the visualisation
 * @returns {string} fields query selector
 */
function getFetchObjectContentFields(visualizationType) {
  switch (visualizationType) {
    case mstrObjectEnum.visualizationType.COMPOUND_GRID:
    case mstrObjectEnum.visualizationType.MICROCHARTS:
      return `-data.metricValues.columnSets.extras,-data.metricValues.columnSets.formatted`;
    default:
      return `-data.metricValues.extras,-data.metricValues.formatted`;
  }
}

/**
 * This function fetches the content of the object.
 * It is used to fetch the dossier or report in chunks to be inserted in workbook.
 * @param {*} fullPath
 * @param {*} authToken
 * @param {*} projectId
 * @param {*} offset
 * @param {*} limit
 * @param {*} visualizationType
 * @returns
 */
async function fetchContentPart(
  fullPath,
  authToken,
  projectId,
  offset,
  limit,
  visualizationType
) {
  const { body: fetchedBody } = await fetchObjectContent(
    fullPath,
    authToken,
    projectId,
    offset,
    limit,
    visualizationType
  );
  if (!fetchedBody.data || !fetchedBody.data.paging) {
    throw new Error(errorMessages.NO_DATA_RETURNED);
  }
  return fetchedBody;
}

/**
 * This function offsets the subtotal row index by the offset value.
 * @param {*} e
 * @param {*} offset
 */
function offsetRowSubtotal(e, offset) {
  if (e) {
    e.rowIndex += offset;
  }
}

/**
 * This function offsets the subtotal column index by the offset value.
 * @param {*} e
 * @param {*} offset
 */
function offsetCrosstabSubtotal(e, offset) {
  if (e && e.axis === 'rows') {
    e.colIndex += offset;
  }
}

class MstrObjectRestService {
  constructor() {
    this.fetchContentGenerator = this.fetchContentGenerator.bind(this);
  }

  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  // eslint-disable-next-line class-methods-use-this
  async* fetchContentGenerator({
    instanceDefinition,
    objectId,
    projectId,
    mstrObjectType,
    dossierData,
    limit = IMPORT_ROW_LIMIT,
    visualizationInfo,
    displayAttrFormNames
  }) {
    const {
      rows: totalRows,
      instanceId,
      mstrTable: { isCrosstab, visualizationType }
    } = instanceDefinition;

    const { envUrl, authToken } = this.reduxStore.getState().sessionReducer;
    const { supportForms } = this.reduxStore.getState().officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };

    let fetchedRows = 0;
    let offset = 0;
    let shouldExtractMetricsInRows = true;
    let metricsInRows = [];
    const fullPath = getFullPath({
      dossierData,
      envUrl,
      mstrObjectType,
      objectId,
      instanceId,
      version: API_VERSION,
      visualizationInfo
    });

    // Declaring these functions outside of the loop to avoid creating them on each iteration
    // and mitigate eslint no-loop-func rule.
    const offsetRowSubtotalFn = (e) => offsetRowSubtotal(e, offset);
    const offsetCrosstabSubtotalFn = (e) => offsetCrosstabSubtotal(e, offset);

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
        shouldExtractMetricsInRows, body, metricsInRows, fetchedBody
      );

      shouldExtractMetricsInRows = metricsInRowsInfo.shouldExtractMetricsInRows;
      metricsInRows = metricsInRowsInfo.metricsInRows;

      fetchedRows = current + offset;
      body.attrforms = attrforms;
      const { row, rowTotals } = officeConverterServiceV2.getRows(
        body,
        isCrosstab
      );

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
        rowsInformation: mstrAttributeFormHelper.splitAttributeForms(metricsInRowsInfo.metricsRows, attrforms)
      };
    }
  }

  answerDossierPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    bIncludeIgnoreRequiredPrompts = false,
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/promptsAnswers${bIncludeIgnoreRequiredPrompts ? '?ignoreRequiredPrompts=true' : ''}`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then((res) => res.status);
  };

  answerPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    bIncludeIgnoreRequiredPrompts = false,
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/reports/${objectId}/instances/${instanceId}/promptsAnswers${bIncludeIgnoreRequiredPrompts ? '?ignoreRequiredPrompts=true' : ''}`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then((res) => res.status);
  };

  createDossierBasedOnReport = (chosenObjectId, instanceId, projectId) => {
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
      .then((res) => res.body);
  };

  createInstance = ({
    objectId,
    projectId,
    mstrObjectType = reportObjectType,
    dossierData,
    body = {},
    limit = 1,
    displayAttrFormNames,
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const fullPath = getFullPath({
      dossierData,
      envUrl,
      limit,
      mstrObjectType,
      objectId,
      version: API_VERSION
    });

    return request
      .post(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then((res) => parseInstanceDefinition(res, attrforms));
  };

  fetchVisualizationDefinition = ({
    projectId,
    objectId,
    instanceId,
    visualizationInfo,
    body,
    displayAttrFormNames
  }) => {
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
      .then((res) => parseInstanceDefinition(res, attrforms));
  };

  createDossierInstance = (projectId, objectId, body = {}) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/dossiers/${objectId}/instances`;
    return request
      .post(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then((res) => res.body);
  };

  getDossierInstanceDefinition = (projectId, objectId, dossierInstanceId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/v2/dossiers/${objectId}/instances/${dossierInstanceId}/definition`;
    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  };

  deleteDossierInstance = (projectId, objectId, instanceId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}`;
    return request
      .delete(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  };

  getDossierStatus = (dossierId, instanceId, projectId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${dossierId}/instances/${instanceId}/status`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res);
  };

  getInstance = ({
    objectId,
    projectId,
    mstrObjectType = reportObjectType,
    dossierData,
    body = {},
    instanceId,
    displayAttrFormNames
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const fullPath = getFullPath({
      dossierData,
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
      .then((res) => parseInstanceDefinition(res, attrforms));
  };

  modifyInstance = ({
    objectId,
    projectId,
    mstrObjectType = reportObjectType,
    dossierData,
    body = {},
    instanceId,
    displayAttrFormNames
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const fullPath = getFullPath({
      dossierData,
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
      .then((res) => parseInstanceDefinition(res, attrforms));
  };

  getObjectDefinition = (
    objectId,
    projectId,
    mstrObjectType = reportObjectType
  ) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const api = API_VERSION > 1 ? 'v2/' : '';
    const fullPath = `${envUrl}/${api}${mstrObjectType.request}/${objectId}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  };

  getObjectInfo = (objectId, projectId, mstrObjectType = reportObjectType) => {
    const storeState = this.reduxStore.getState();
    // visualisation does not have object type, all other objects has type represented by number
    // If we pass not a number we know its visualisation and we set type as 55 (document)
    if (typeof mstrObjectType.type !== 'number') {
      mstrObjectType.type = 55;
    }
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/objects/${objectId}?type=${mstrObjectType.type}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  };

  /**
   * Gets the prompts applied to the object's instance.
   *
   * @param {String} objectId Id of an object
   * @param {String} projectId Id of a project
   * @param {String} instanceId Id of an instance
   * @param {Boolean} bIncludeClosedPrompts Whether to request to include closed prompts
   */
  getObjectPrompts = (objectId, projectId, instanceId, bIncludeClosedPrompts = false) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts${bIncludeClosedPrompts ? '?closed=true' : ''}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  };

  isPrompted = (objectId, projectId, objectTypeName) => {
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
      .then((res) => ({
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
   * @param {string} objectId
   * @param {string} projectId
   * @returns {Object} Contains info for cube that match objectId and projectId
   */
  getCubeInfo = (objectId, projectId) => new Promise((resolve, reject) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/cubes?id=${objectId}`;
    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .withCredentials()
      .then((res) => resolve(res.body.cubesInfos[0]))
      .catch((error) => reject(error));
  });

  rePromptDossier = (dossierId, instanceId, projectId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${dossierId}/instances/${instanceId}/rePrompt`;

    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .withCredentials()
      .then((res) => res.body);
  };

  /**
   * Answer specified prompts on the document/dossier instance,
   * prompts can either be answered with default answers(if available)
   * @param {*} param0
   * @returns
   */
  updateDossierPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    bIncludeIgnoreRequiredPrompts = false,
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts/answers${bIncludeIgnoreRequiredPrompts ? '?ignoreRequiredPrompts=true' : ''}`;
    return request
      .put(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send({ prompts: promptsAnswers.answers })
      .withCredentials()
      .then((res) => res.status);
  };

  updateReportPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    bIncludeIgnoreRequiredPrompts = false,
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/reports/${objectId}/instances/${instanceId}/prompts/answers${bIncludeIgnoreRequiredPrompts ? '?ignoreRequiredPrompts=true' : ''}`;
    return request
      .put(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send({ prompts: promptsAnswers })
      .withCredentials()
      .then((res) => res.status);
  };

  applyDossierPrompts = ({
    objectId,
    projectId,
    instanceId,
    promptsAnswers,
    bIncludeIgnoreRequiredPrompts = false,
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/dossiers/${objectId}/instances/${instanceId}/answerPrompts${bIncludeIgnoreRequiredPrompts ? '?ignoreRequiredPrompts=true' : ''}`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then((res) => res.status);
  };

  /**
   * This method is used to fetch attribute's elements list for a given prompt defined in a dossier's instance
   *
   * @param {*} objectId
   * @param {*} projectId
   * @param {*} instanceId
   * @param {*} promptId
   * @returns {Promise} Promise object represents the list of attribute's elements
   */
  getPromptElements = (objectId, projectId, instanceId, promptId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts/${promptId}/elements`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  };

  /**
   * This method fetches the list of objects elements for a given prompt defined in a dossier's instance
   *
   * @param {*} objectId
   * @param {*} projectId
   * @param {*} instanceId
   * @param {*} promptId
   * @returns array of objects elements
   */
  getPromptObjectElements = (objectId, projectId, instanceId, promptId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts/${promptId}/objects`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  };
}

export const mstrObjectRestService = new MstrObjectRestService();
