import {errorService} from '../error/error-handler';
import {reduxStore} from '../store';
import {moduleProxy} from '../module-proxy';

const sharedFolderIdType = 7;
const REQUEST_LIMIT = 1000;
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
          throw errorService.errorRestFactory(err);
        });
  }

  async getObjectContent(objectId, projectId, isReport = true, body) {
    const storeState = reduxStore.getState();
    const envUrl = storeState.sessionReducer.envUrl;
    const authToken = storeState.sessionReducer.authToken;
    const objectType = isReport ? 'reports' : 'cubes';
    let fullPath = `${envUrl}/${objectType}/${objectId}/instances`;

    const reportInstance = await this._getInstanceId(fullPath, authToken, projectId, body);
    fullPath += `/${reportInstance}`;
    try {
      return await this._getObjectContentPaginated(fullPath, authToken, projectId);
    } catch (error) {
      errorService.errorRestFactory(error);
    }
  }

  _getObjectContentPaginated(fullPath, authToken, projectId) {
    return new Promise((resolve, reject) => {
      this._fetchObjectContent(fullPath, authToken, projectId, resolve, reject);
    });
  }

  _fetchObjectContent(fullPath, authToken, projectId, resolve, reject, aggregatedData = {}, offset = 0, limit = REQUEST_LIMIT) {
    return moduleProxy.request
        .get(`${fullPath}?offset=${offset}&limit=${limit}`)
        .set('x-mstr-authtoken', authToken)
        .set('x-mstr-projectid', projectId)
        .withCredentials()
        .then((res) => {
          const {current, total} = res.body.result.data.paging;
          const fetchedRows = current + offset;
          console.log(current, offset, total);
          if (offset === 0) {
            aggregatedData = res.body;
          } else {
            console.log(aggregatedData.result.data.root.children);
            aggregatedData.result.data.root.children.push(...res.body.result.data.root.children);
          }

          if (fetchedRows >= total || fetchedRows >= EXCEL_ROW_LIMIT) {
            resolve(aggregatedData);
          } else {
            offset += current;
            this._fetchObjectContent(fullPath, authToken, projectId, resolve, reject, aggregatedData, offset, limit);
          }
        })
        .catch(reject);
  }
};


export const mstrObjectRestService = new MstrObjectRestService();
