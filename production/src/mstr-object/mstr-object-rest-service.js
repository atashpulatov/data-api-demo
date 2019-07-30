import {errorService} from '../error/error-handler';
import {OutsideOfRangeError} from '../error/outside-of-range-error';
import {reduxStore} from '../store';
import {moduleProxy} from '../module-proxy';
import officeConverterServiceV2 from '../office/office-converter-service-v2';

const sharedFolderIdType = 7;

export const DATA_LIMIT = 200000; // 200000 is around 1mb of MSTR JSON response
export const PROMISE_LIMIT = 10; // Number of concurrent context.sync() promises during data import.
export const IMPORT_ROW_LIMIT = 20000; // Maximum number of rows to fetch during data import (For few columns tables).
const EXCEL_ROW_LIMIT = 1048576;
const EXCEL_COLUMN_LIMIT = 16384;
const OBJECT_TYPE = '3'; // both reports and cubes are of type 3
const API_VERSION = 2;

class MstrObjectRestService {
  getProjectContent(envUrl, authToken, projectId,
      folderType = sharedFolderIdType) {
    const fullPath = `${envUrl}/folders/preDefined/${folderType}`;
    return moduleProxy.request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials()
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }

  getFolderContent(envUrl, authToken, projectId, folderId) {
    const fullPath = `${envUrl}/folders/${folderId}`;
    return moduleProxy.request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials()
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }

  _getInstanceId(fullPath, authToken, projectId, body) { // Used for unit testing, apparently
    return moduleProxy.request
        .post(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .send(body)
        .withCredentials()
        .then((res) => {
          if (res.status === 200 && res.body.status === 2) {
            throw (res);
          }
          return res.body.instanceId;
        })
        .catch((err) => {
          throw err;
        });
  }

  _createInstance(fullPath, authToken, projectId, body) {
    return moduleProxy.request
        .post(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .send(body)
        .withCredentials()
        .then((res) => {
          return this._parseInstanceDefinition(res);
        });
  }

  _getInstance(fullPath, authToken, projectId, body) {
    return moduleProxy.request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .send(body)
        .withCredentials()
        .then((res) => {
          return this._parseInstanceDefinition(res);
        });
  }

  _getDossierInstanceDefinition(fullPath, authToken, projectId, body) {
    return moduleProxy.request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .send(body)
        .withCredentials()
        .then((res) => {
          if (res.status === 200 && res.body.status === 2) {
            throw (res);
          }
          return this._parseInstanceDefinition(res);
        });
  }

  _parseInstanceDefinition(res) {
    const {body} = res;
    if (res.status === 200 && body.status === 2) {
      const {instanceId} = body;
      const status = body.status;
      return {instanceId, status};
    }
    const {instanceId} = body;
    const mstrTable = officeConverterServiceV2.createTable(body);
    const {rows, columns} = this._checkTableDimensions(mstrTable.tableSize);
    return {instanceId, rows, columns, mstrTable};
  }

  getObjectDefinition(objectId, projectId, isReport = true) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const objectType = isReport ? 'reports' : 'cubes';
    const api = API_VERSION > 1 ? 'v2/' : '';
    const fullPath = `${envUrl}/${api}${objectType}/${objectId}`;

    return moduleProxy.request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials()
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }

  getObjectInfo(objectId, projectId, isReport = true) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const fullPath = `${envUrl}/objects/${objectId}?type=${OBJECT_TYPE}`;

    return moduleProxy.request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials()
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }

  async createInstance(objectId, projectId, isReport = true, dossierData, body = {}, limit = 1) {
    try {
      const storeState = reduxStore.getState();
      const envUrl = storeState.sessionReducer.envUrl;
      const authToken = storeState.sessionReducer.authToken;
      const fullPath = this._getFullPath({dossierData, envUrl, limit, isReport, objectId, version: API_VERSION});
      return await this._createInstance(fullPath, authToken, projectId, body);
    } catch (error) {
      throw error instanceof OutsideOfRangeError ? error : errorService.errorRestFactory(error);
    }
  }

  getInstance(objectId, projectId, isReport = true, dossierData, body = {}, instanceId, limit = 1) {
    try {
      const storeState = reduxStore.getState();
      const envUrl = storeState.sessionReducer.envUrl;
      const authToken = storeState.sessionReducer.authToken;
      const fullPath = this._getFullPath({dossierData, envUrl, limit, isReport, objectId, instanceId, version: API_VERSION});
      return this._getInstance(fullPath, authToken, projectId, body);
    } catch (error) {
      throw error instanceof OutsideOfRangeError ? error : errorService.errorRestFactory(error);
    }
  }

  getObjectContentGenerator(instanceDefinition, objectId, projectId, isReport, dossierData, body, limit = DATA_LIMIT) {
    return fetchContentGenerator(instanceDefinition, objectId, projectId, isReport, dossierData, body, limit);
  }

  _fetchObjectContent(fullPath, authToken, projectId, offset = 0, limit = -1) {
    return moduleProxy.request
        .get(`${fullPath}?offset=${offset}&limit=${limit}`)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials();
  }

  _checkTableDimensions(tableSize) {
    const {rows, columns} = tableSize;
    if (rows >= EXCEL_ROW_LIMIT || columns >= EXCEL_COLUMN_LIMIT) {
      throw new OutsideOfRangeError();
    }
    return {rows, columns};
  }

  _getFullPath({dossierData, envUrl, limit, isReport, objectId, instanceId, version = 1}) {
    let path;
    const api = version > 1 ? `v${version}/` : '';
    const objectType = isReport ? 'reports' : 'cubes';
    path = `${envUrl}/${api}${objectType}/${objectId}/instances`;
    path += instanceId ? `/${instanceId}` : '';
    path += limit ? `?limit=${limit}` : '';
    return path;
  }

  isPrompted(objectId, projectId) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const fullPath = `${envUrl}/reports/${objectId}/prompts`;
    return moduleProxy.request
        .get(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('X-MSTR-ProjectID', projectId)
        .withCredentials()
        .then((res) => {
          return res.body && res.body.length;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }

  answerPrompts(objectId, projectId, instanceId, promptsAnswers) {
    try {
      const storeState = reduxStore.getState();
      const envUrl = storeState.sessionReducer.envUrl;
      const authToken = storeState.sessionReducer.authToken;
      const fullPath = `${envUrl}/reports/${objectId}/instances/${instanceId}/promptsAnswers`;
      return moduleProxy.request
          .post(fullPath)
          .set('X-MSTR-AuthToken', authToken)
          .set('X-MSTR-ProjectID', projectId)
          .send(promptsAnswers)
          .withCredentials()
          .then((res) => {
            return res.status;
          })
          .catch((err) => {
            throw errorService.errorRestFactory(err);
          });
    } catch (error) {
      throw errorService.errorRestFactory(error);
    }
  }

  deleteDossierInstance(projectId, objectId, instanceId) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const fullPath = `${envUrl}/documents/${objectId}/instances/${instanceId}`;
    return moduleProxy.request
        .delete(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials()
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }
};

async function* fetchContentGenerator(instanceDefinition, objectId, projectId, isReport, dossierData, body, limit) {
  try {
    const totalRows = instanceDefinition.rows;
    const {instanceId, mstrTable} = instanceDefinition;
    const {isCrosstab} = mstrTable;

    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const fullPath = mstrObjectRestService._getFullPath({dossierData, envUrl, isReport, objectId, instanceId, version: API_VERSION});
    let fetchedRows = 0;
    let offset = 0;

    while (fetchedRows < totalRows && fetchedRows < EXCEL_ROW_LIMIT) {
      const response = await mstrObjectRestService._fetchObjectContent(fullPath, authToken, projectId, offset, limit);
      const {current} = response.body.data.paging;
      fetchedRows = current + offset;
      offset += current;
      const row = officeConverterServiceV2.getRows(response.body, isCrosstab);
      let header;
      if (isCrosstab) {
        header = officeConverterServiceV2.getHeaders(response.body);
      }
      yield {row, header};
    }
  } catch (error) {
    console.log(error);
    throw errorService.errorRestFactory(error);
  }
}

export const mstrObjectRestService = new MstrObjectRestService();
