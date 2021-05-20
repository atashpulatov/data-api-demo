import request from 'superagent';
import { NO_DATA_RETURNED } from '../error/constants';
import { OutsideOfRangeError } from '../error/outside-of-range-error';
import officeConverterServiceV2 from '../office/office-converter-service-v2';
import mstrObjectEnum from './mstr-object-type-enum';
import MstrAttributeMetricHelper from './helper/mstr-attribute-metric-helper';

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
  if (data.paging.total === 0) { throw new Error(NO_DATA_RETURNED); }
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
  const fields = getFetchObjectContentFields(visualizationType);

  return request
    .get(`${fullPath}?offset=${offset}&limit=${limit}&fields=${fields}`)
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

function prepareVisualizationInfoObject(
  chapterKey, pageKey, visualizationKey, chapterName, dossierName, pageName, panelStackTree
) {
  return {
    chapterKey,
    pageKey,
    visualizationKey,
    dossierStructure: {
      chapterName,
      dossierName,
      pageName,
    },
    panelStackTree,
  };
}

function parsePanelStacks(
  givenPanelStacks, visualizationKey, chapterKey, pageKey, chapterName, dosierName, pageName, currentPanelStackTree
) {
  for (const panelStack of givenPanelStacks) {
    for (const panel of panelStack.panels) {
      const panelLocation = { panelKey: panel.key, panelStackKey: panelStack.key };
      const newPanelStackTree = [...currentPanelStackTree, panelLocation];

      if (panel.visualizations) {
        for (const visualization of panel.visualizations) {
          if (visualization.key === visualizationKey) {
            return prepareVisualizationInfoObject(
              chapterKey, pageKey, visualizationKey, chapterName, dosierName, pageName, newPanelStackTree
            );
          }
        }
      }

      if (panel.panelStacks) {
        return parsePanelStacks(
          panel.panelStacks, visualizationKey, chapterKey, pageKey, chapterName, dosierName, pageName, newPanelStackTree
        );
      }
    }
  }

  return null;
}

class MstrObjectRestService {
  constructor() {
    this.fetchContentGenerator = this.fetchContentGenerator.bind(this);
  }

  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

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
    const totalRows = instanceDefinition.rows;
    const { instanceId, mstrTable: { isCrosstab, visualizationType } } = instanceDefinition;
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
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
      visualizationInfo,
    });


    const offsetSubtotal = (e) => {
      if (e) { (e.rowIndex += offset); }
    };
    const offsetCrosstabSubtotal = (e) => {
      if (e && e.axis === 'rows') { (e.colIndex += offset); }
    };


    while (fetchedRows < totalRows && fetchedRows < EXCEL_ROW_LIMIT) {
      let header;
      let crosstabSubtotal;

      const response = await fetchObjectContent(fullPath, authToken, projectId, offset, limit, visualizationType);


      const { current } = response.body.data.paging;
      if (MstrAttributeMetricHelper.isMetricInRows(response.body) && shouldExtractMetricsInRows) {
        metricsInRows = MstrAttributeMetricHelper.getMetricsInRows(response.body, metricsInRows);
        shouldExtractMetricsInRows = !!metricsInRows.length;
      }

      fetchedRows = current + offset;
      response.body.attrforms = attrforms;
      const { row, rowTotals } = officeConverterServiceV2.getRows(response.body, isCrosstab);

      if (isCrosstab) {
        header = officeConverterServiceV2.getHeaders(response.body, isCrosstab);
        crosstabSubtotal = header.subtotalAddress;
        if (offset !== 0) { crosstabSubtotal.map(offsetCrosstabSubtotal); }
      } else if (offset !== 0) {
        rowTotals.map(offsetSubtotal);
      }
      offset += current;

      yield {
        row,
        header,
        subtotalAddress: isCrosstab ? crosstabSubtotal : rowTotals,
        metricsInRows
      };
    }
  }

  /**
   * Get visualization key, page key, chapter key, and dossier structure with names from dossier hierarchy.
   *
   * In case if visualization key is not found in dossier, it returns undefined.
   *
   * Exceptions are handled by callers.
   *
   * @param {String} projectId
   * @param {String} objectId
   * @param {String} visualizationKey visualization id
   * @param {Object} dossierInstance
   * @returns {Object} Contains info for visualization or null if visualization key is not found
   */
  getVisualizationInfo = async (projectId, objectId, visualizationKey, dossierInstance) => {
    const dossierDefinition = await this.getDossierInstanceDefinition(projectId, objectId, dossierInstance);

    for (const chapter of dossierDefinition.chapters) {
      for (const page of chapter.pages) {
        for (const visualization of page.visualizations) {
          if (visualization.key === visualizationKey) {
            return prepareVisualizationInfoObject(
              chapter.key, page.key, visualizationKey, chapter.name, dossierDefinition.name, page.name, []
            );
          }
        }

        if (page.panelStacks) {
          return parsePanelStacks(
            page.panelStacks, visualizationKey, chapter.key, page.key,
            chapter.name, dossierDefinition.name, page.name, []
          );
        }
      }
    }

    return null;
  };

  answerDossierPrompts = ({
    objectId, projectId, instanceId, promptsAnswers
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/promptsAnswers`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then((res) => res.status);
  }

  answerPrompts = ({
    objectId, projectId, instanceId, promptsAnswers
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/reports/${objectId}/instances/${instanceId}/promptsAnswers`;
    return request
      .post(fullPath)
      .set('X-MSTR-AuthToken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .send(promptsAnswers)
      .withCredentials()
      .then((res) => res.status);
  }

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
  }

  createInstance = ({
    objectId,
    projectId,
    mstrObjectType = reportObjectType,
    dossierData,
    body = {},
    limit = 1,
    displayAttrFormNames
  }) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const { supportForms } = storeState.officeReducer;
    const attrforms = { supportForms, displayAttrFormNames };
    const fullPath = getFullPath({
      dossierData, envUrl, limit, mstrObjectType, objectId, version: API_VERSION
    });

    return request
      .post(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .send(body)
      .withCredentials()
      .then((res) => parseInstanceDefinition(res, attrforms));
  }

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
  }

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
      .then((res) => res.body.mid);
  }

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
  }


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
  }

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
  }

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
  }

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
  }


  getObjectDefinition = (objectId, projectId, mstrObjectType = reportObjectType) => {
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
  }

  getObjectInfo = (objectId, projectId, mstrObjectType = reportObjectType) => {
    const storeState = this.reduxStore.getState();
    if (mstrObjectType.type === 'undefined') {
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
  }

  /**
   * Gets the prompts applied to the object's instance.
   *
   * @param {String} objectId Id of an object
   * @param {String} projectId Id of a project
   * @param {String} instanceId Id of an instance
   */
  getObjectPrompts = (objectId, projectId, instanceId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}/prompts`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  }

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
      .then((res) => res.body && res.body.length);
  }

  /**
   * Function getting information about a cube from a certain project.
   *
   * @param {string} objectId
   * @param {string} projectId
   * @returns {Object} Contains info for cube that match objectId and projectId
   */
  getCubeInfo = (objectId, projectId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/cubes?id=${objectId}`;
    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('X-MSTR-ProjectID', projectId)
      .withCredentials()
      .then((res) => res.body.cubesInfos[0]);
  }

  rePromptDossier = (dossierId, instanceId, projectId) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/documents/${dossierId}/instances/${instanceId}/rePrompt`;

    return request
      .post(fullPath)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then((res) => res.body);
  }
}

export const mstrObjectRestService = new MstrObjectRestService();
