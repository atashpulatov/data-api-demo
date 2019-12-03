/* eslint-disable no-await-in-loop */
import request from 'superagent';
import { NOT_SUPPORTED_NO_ATTRIBUTES } from '../error/constants';
import { OutsideOfRangeError } from '../error/outside-of-range-error';
import { reduxStore } from '../store';
import officeConverterServiceV2 from '../office/office-converter-service-v2';
import mstrObjectEnum from './mstr-object-type-enum';

const reportObjectType = mstrObjectEnum.mstrObjectType.report;

const API_VERSION = 2;
const EXCEL_COLUMN_LIMIT = 16384;
const EXCEL_ROW_LIMIT = 1048576;
export const CONTEXT_LIMIT = 500; // Maximum number of Excel operations before context syncing.
export const DATA_LIMIT = 200000; // 200000 is around 1mb of MSTR JSON response
export const IMPORT_ROW_LIMIT = 20000; // Maximum number of rows to fetch during data import.
export const PROMISE_LIMIT = 10; // Number of concurrent context.sync() promises during data import.

export function answerDossierPrompts({ objectId, projectId, instanceId, promptsAnswers }) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/promptsAnswers`;
  return request
    .post(fullPath)
    .set('X-MSTR-AuthToken', authToken)
    .set('X-MSTR-ProjectID', projectId)
    .send(promptsAnswers)
    .withCredentials()
    .then((res) => res.status);
}

export function answerPrompts({ objectId, projectId, instanceId, promptsAnswers }) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/reports/${objectId}/instances/${instanceId}/promptsAnswers`;
  return request
    .post(fullPath)
    .set('X-MSTR-AuthToken', authToken)
    .set('X-MSTR-ProjectID', projectId)
    .send(promptsAnswers)
    .withCredentials()
    .then((res) => res.status);
}

export function createDossierBasedOnReport(reportId, instanceId, projectId) {
  // TODO: get rid of the getState
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/dossiers/instances`;
  const body = {
    objects: [
      {
        type: 3,
        id: reportId,
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
}

function checkTableDimensions({ rows, columns }) {
  if (rows >= EXCEL_ROW_LIMIT || columns >= EXCEL_COLUMN_LIMIT) {
    throw new OutsideOfRangeError();
  }
  return { rows, columns };
}

function parseInstanceDefinition(res) {
  const { body } = res;
  if (res.status === 200 && body.status === 2) {
    const { instanceId } = body;
    const { status } = body;
    return { instanceId, status };
  }
  const { instanceId, data, internal } = body;
  if (data.paging.total === 0) throw new Error(NOT_SUPPORTED_NO_ATTRIBUTES);
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

export function createInstance({
  objectId,
  projectId,
  mstrObjectType = reportObjectType,
  dossierData,
  body = {},
  limit = 1,
}) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = getFullPath({ dossierData, envUrl, limit, mstrObjectType, objectId, version: API_VERSION });

  return request
    .post(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .send(body)
    .withCredentials()
    .then((res) => parseInstanceDefinition(res));
}

export function fetchVisualizationDefinition({ projectId, objectId, instanceId, visualizationInfo, body, }) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const { chapterKey, visualizationKey } = visualizationInfo;
  const fullPath = `${envUrl}/v2/dossiers/${objectId}/instances/${instanceId}/chapters/${chapterKey}/visualizations/${visualizationKey}?limit=1&contentFlags=768`;
  return request
    .get(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .send(body || '')
    .withCredentials()
    .then((res) => parseInstanceDefinition(res));
}

export function createDossierInstance(projectId, objectId, body = {}) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/dossiers/${objectId}/instances`;
  return request
    .post(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .send(body)
    .withCredentials()
    .then((res) => res.body.mid);
}

export function getDossierDefinition(projectId, objectId) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/v2/dossiers/${objectId}/definition`;
  return request
    .get(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials()
    .then((res) => res.body);
}


export function deleteDossierInstance(projectId, objectId, instanceId) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}`;
  return request
    .delete(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials()
    .then((res) => res.body);
}

export function getDossierStatus(dossierId, instanceId, projectId) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/documents/${dossierId}/instances/${instanceId}/status`;

  return request
    .get(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials()
    .then((res) => res);
}

export function getInstance({
  objectId,
  projectId,
  mstrObjectType = reportObjectType,
  dossierData,
  body = {},
  instanceId
}) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
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
    .then((res) => parseInstanceDefinition(res));
}

function getFullPath({ envUrl, limit, mstrObjectType, objectId, instanceId, version = 1, visualizationInfo = false, }) {
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

export function modifyInstance({
  objectId,
  projectId,
  mstrObjectType = reportObjectType,
  dossierData,
  body = {},
  instanceId
}) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
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
    .then((res) => parseInstanceDefinition(res));
}

export function getObjectContentGenerator({
  instanceDefinition,
  objectId,
  projectId,
  mstrObjectType,
  dossierData,
  limit = IMPORT_ROW_LIMIT,
  visualizationInfo,
}) {
  return fetchContentGenerator({
    instanceDefinition,
    objectId,
    projectId,
    mstrObjectType,
    dossierData,
    limit,
    visualizationInfo,
  });
}

export function getObjectDefinition(objectId, projectId, mstrObjectType = reportObjectType) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const api = API_VERSION > 1 ? 'v2/' : '';
  const fullPath = `${envUrl}/${api}${mstrObjectType.request}/${objectId}`;

  return request
    .get(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials()
    .then((res) => res.body);
}

export function getObjectInfo(objectId, projectId, mstrObjectType = reportObjectType) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/objects/${objectId}?type=${mstrObjectType.type}`;

  return request
    .get(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials()
    .then((res) => res.body);
}

export function isPrompted(objectId, projectId, objectTypeName) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
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
    .then((res) => res.body && res.body.length);
}

export function getCubeStatus(objectId, projectId) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;

  const fullPath = `${envUrl}/cubes/${objectId}`;
  return request
    .head(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('X-MSTR-ProjectID', projectId)
    .withCredentials()
    .then((res) => res.headers['x-mstr-cubestatus']);
}

export function rePromptDossier(dossierId, instanceId, projectId) {
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  const fullPath = `${envUrl}/documents/${dossierId}/instances/${instanceId}/rePrompt`;

  return request
    .post(fullPath)
    .set('x-mstr-authtoken', authToken)
    .set('x-mstr-projectid', projectId)
    .withCredentials()
    .then((res) => res.body);
}


async function* fetchContentGenerator({
  instanceDefinition,
  objectId,
  projectId,
  mstrObjectType,
  dossierData,
  limit,
  visualizationInfo
}) {
  const totalRows = instanceDefinition.rows;
  const { instanceId, mstrTable } = instanceDefinition;
  const { isCrosstab } = mstrTable;
  const storeState = reduxStore.getState();
  const { envUrl } = storeState.sessionReducer;
  const { authToken } = storeState.sessionReducer;
  let fetchedRows = 0;
  let offset = 0;
  const fullPath = getFullPath({
    dossierData,
    envUrl,
    mstrObjectType,
    objectId,
    instanceId,
    version: API_VERSION,
    visualizationInfo,
  });


  const offsetSubtotal = (e) => {
    if (e) (e.rowIndex += offset);
  };
  const offsetCrosstabSubtotal = (e) => {
    if (e && e.axis === 'rows') (e.colIndex += offset);
  };

  function fetchObjectContent(fullPath, authToken, projectId, offset = 0, limit = -1) {
    return request
      .get(`${fullPath}?offset=${offset}&limit=${limit}`)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials();
  }

  while (fetchedRows < totalRows && fetchedRows < EXCEL_ROW_LIMIT) {
    let header;
    let crosstabSubtotal;
    const response = await fetchObjectContent(fullPath, authToken, projectId, offset, limit);
    const { current } = response.body.data.paging;
    fetchedRows = current + offset;
    const { row, rowTotals } = officeConverterServiceV2.getRows(response.body, isCrosstab);
    if (isCrosstab) {
      header = officeConverterServiceV2.getHeaders(response.body);
      crosstabSubtotal = header.subtotalAddress;
      if (offset !== 0) crosstabSubtotal.map(offsetCrosstabSubtotal);
    } else if (offset !== 0) {
      rowTotals.map(offsetSubtotal);
    }
    offset += current;
    yield {
      row,
      header,
      subtotalAddress: isCrosstab ? crosstabSubtotal : rowTotals,
    };
  }
}

export default {
  answerDossierPrompts,
  answerPrompts,
  createDossierBasedOnReport,
  createInstance,
  createDossierInstance,
  deleteDossierInstance,
  getDossierStatus,
  getInstance,
  getObjectContentGenerator,
  getObjectDefinition,
  getObjectInfo,
  isPrompted,
  modifyInstance,
  rePromptDossier,
  fetchVisualizationDefinition,
  getDossierDefinition,
  getCubeStatus,
};
