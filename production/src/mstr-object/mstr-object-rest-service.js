import {errorService} from '../error/error-handler';
import {reduxStore} from '../store';
import {moduleProxy} from '../module-proxy';
import {officeConverterService} from '../office/office-converter-service';

const sharedFolderIdType = 7;
const REQUEST_LIMIT = 5000;
const EXCEL_ROW_LIMIT = 1048576;

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
          return res.body.instanceId;
        })
        .catch((err) => {
          throw err;
        });
  }

  async getObjectContent(objectId, projectId, isReport = true, body = {}, limit = REQUEST_LIMIT) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const objectType = isReport ? 'reports' : 'cubes';
    let fullPath = `${envUrl}/${objectType}/${objectId}/instances`;

    try {
      const reportInstance = await this._getInstanceId(fullPath, authToken, projectId, body);
      fullPath += `/${reportInstance}`;
      return await this._getObjectContentPaginated(fullPath, authToken, projectId, limit);
    } catch (error) {
      throw errorService.errorRestFactory(error);
    }
  }

  _getObjectContentPaginated(fullPath, authToken, projectId, limit) {
    return new Promise((resolve, reject) => {
      let mstrTable;
      this._fetchObjectContent(fullPath, authToken, projectId, resolve, reject, 0, limit, mstrTable);
    });
  }

  _fetchObjectContent(fullPath, authToken, projectId, resolve, reject, offset = 0, limit = REQUEST_LIMIT, mstrTable) {
    return moduleProxy.request
        .get(`${fullPath}?offset=${offset}&limit=${limit}`)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials()
        .then((res) => {
          const {current, total} = res.body.result.data.paging;
          const fetchedRows = current + offset;
          if (offset === 0) {
            mstrTable = officeConverterService.createTable(res.body);
          } else {
            mstrTable = officeConverterService.appendRows(mstrTable, res.body);
          }

          if (fetchedRows >= total || fetchedRows >= EXCEL_ROW_LIMIT) {
            resolve(mstrTable);
          } else {
            offset += current;
            this._fetchObjectContent(fullPath, authToken, projectId, resolve, reject, offset, limit, mstrTable);
          }
        })
        .catch(reject);
  }
};


export const mstrObjectRestService = new MstrObjectRestService();
