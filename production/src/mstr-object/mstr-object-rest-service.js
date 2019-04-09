import {errorService} from '../error/error-handler';
import {OutsideOfRangeError} from '../error/outside-of-range-error';
import {reduxStore} from '../store';
import {moduleProxy} from '../module-proxy';
import {officeConverterService} from '../office/office-converter-service';

const sharedFolderIdType = 7;
// 200000 is around 1mb of MSTR JSON response
export const DATA_LIMIT = 200000;
const EXCEL_ROW_LIMIT = 1048576;
const EXCEL_COLUMN_LIMIT = 16384;

class MstrObjectRestService {
  async getProjectContent(envUrl, authToken, projectId,
      folderType = sharedFolderIdType) {
    const fullPath = `${envUrl}/folders/preDefined/${folderType}`;
    return await moduleProxy.request
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

  async getFolderContent(envUrl, authToken, projectId, folderId) {
    const fullPath = `${envUrl}/folders/${folderId}`;
    return await moduleProxy.request
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

  async _getInstanceId(fullPath, authToken, projectId, body) {
    return await moduleProxy.request
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

  async _getInstanceDefinition(fullPath, authToken, projectId, body) {
    return await moduleProxy.request
        .post(fullPath)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .send(body)
        .withCredentials()
        .then((res) => {
          if (res.status === 200 && res.body.status === 2) {
            throw (res);
          }
          const {total} = res.body.result.data.paging;
          const {instanceId} = res.body;
          const mstrTable = officeConverterService.createTable(res.body);
          const {rows, columns} = this._checkTableDimensions(total, mstrTable.headers.length);
          return {instanceId, rows, columns, mstrTable};
        });
  }

  async getObjectInfo(objectId, projectId, isReport = true) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const objectType = isReport ? 'reports' : 'cubes';
    const fullPath = `${envUrl}/${objectType}/${objectId}`;

    return await moduleProxy.request
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
  };

  async getInstanceDefinition(objectId, projectId, isReport = true, body = {}, limit = 1) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const objectType = isReport ? 'reports' : 'cubes';
    const fullPath = `${envUrl}/${objectType}/${objectId}/instances?limit=${limit}`;

    try {
      return await this._getInstanceDefinition(fullPath, authToken, projectId, body);
    } catch (error) {
      throw errorService.errorRestFactory(error);
    }
  }

  getObjectContentGenerator(instanceDefinition, objectId, projectId, isReport, body, limit = DATA_LIMIT) {
    return fetchContentGenerator(instanceDefinition, objectId, projectId, isReport, body, limit);
  }

  _fetchObjectContent(fullPath, authToken, projectId, offset = 0, limit = -1) {
    return moduleProxy.request
        .get(`${fullPath}?offset=${offset}&limit=${limit}`)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials();
  }

  _checkTableDimensions(rows, columns) {
    if (rows >= EXCEL_ROW_LIMIT || columns >= EXCEL_COLUMN_LIMIT) {
      throw new OutsideOfRangeError();
    }
    return {rows, columns};
  }
};

async function* fetchContentGenerator(instanceDefinition, objectId, projectId, isReport, body, limit) {
  try {
    const totalRows = instanceDefinition.rows;
    const {instanceId, mstrTable} = instanceDefinition;

    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const objectType = isReport ? 'reports' : 'cubes';
    const fullPath = `${envUrl}/${objectType}/${objectId}/instances/${instanceId}`;
    let fetchedRows = 0;
    let offset = 0;

    while (fetchedRows < totalRows && fetchedRows < EXCEL_ROW_LIMIT) {
      const response = await mstrObjectRestService._fetchObjectContent(fullPath, authToken, projectId, offset, limit);
      const {current} = response.body.result.data.paging;
      fetchedRows = current + offset;
      offset += current;
      yield officeConverterService.getRows(response.body, mstrTable.headers);
    }
  } catch (error) {
    console.log(error);
    throw errorService.errorRestFactory(error);
  }
}

export const mstrObjectRestService = new MstrObjectRestService();
