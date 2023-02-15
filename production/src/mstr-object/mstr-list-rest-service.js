import request from 'superagent';
import filterDossiersByViewMedia from '../helpers/viewMediaHelper';
import Queue from '../cache/queue';

const SEARCH_ENDPOINT = 'searches/results';
const PROJECTS_ENDPOINT = 'projects';
const MY_LIBRARY_ENDPOINT = 'library';
const LIMIT = 7000;
const DOSSIER_SUBTYPE = 14081;
const SUBTYPES = [768, 769, 774, 776, 779, DOSSIER_SUBTYPE];

class MstrListRestService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Uses imported helper function to check whether object is a Dossier, but only if it is the same subtype as Dossier
   *
   * @param {Object} object MicroStrategy Object (Resport, Dossier, Cube)
   * @returns {Boolean}
   */
  filterFunction = (object) => {
    if (object.subtype === DOSSIER_SUBTYPE) {
      return filterDossiersByViewMedia(object.viewMedia);
    }
    return true;
  };

  /**
   * Applies filtering function to body.result array of objects
   *
   * @param {Object} body - MSTR API response body
   * @returns {Array}
   */
  filterDossier = (body) => {
    const { result } = body;
    return result.filter(this.filterFunction);
  };

  /**
   * Extracts the totalItems value from the response body
   *
   * @param {*} body
   * @returns
   */
  processTotalItems = (body) => body.totalItems;

  /**
   * Creates the request parameters from redux state
   *
   * @returns
   */
  getRequestParams = () => {
    const { sessionReducer } = this.reduxStore.getState();
    const { envUrl, authToken } = sessionReducer;
    const typeQuery = SUBTYPES.join('&type=');
    const getAncestors = true;
    return {
      envUrl, authToken, typeQuery, getAncestors
    };
  };

  /**
   * Get a projects dictionary with key:value {id:name} pairs
   *
   * @returns {Object} {ProjetId: projectName}
   */
  getProjectDictionary = () => this.fetchProjects()
    .then((projects) => projects.reduce((dict, project) => ({ ...dict, [project.id]: project.name || '' }), {}));

  /**
   * Fetches object of given subtypes from MSTR API per project.
   *
   * @param {Object} { requestParams, callback = (res) => res, offset = 0, limit = LIMIT }
   * @param {Object} requestParams - Object containing environment url, authToken and
   * subtypes of objects, for which to execute the request
   * @param {Function} callback - Function to be applied to the returned response body
   * @param {number} offset - Starting index of object to be fetched
   * @param {number} limit - Number of objects to be fetched per request
   * @param {string} projectId - Id of the project to be fetched
   * @param {Array} resultArray - Array of objects that is passed during reccurent function call for projects > 7000
   * @returns {Array} of MSTR objects
   */
  fetchObjectListByProject({
    requestParams, callback = this.filterDossier, offset = 0, limit = LIMIT
  },
  projectId, queue) {
    const {
      envUrl, authToken, typeQuery, getAncestors
    } = requestParams;

    const { officeReducer } = this.reduxStore.getState();
    const { showHidden } = officeReducer;

    // We omit the query when we want to show all objects(including hidden)
    // Setting query to &result.hidden=true would result in fetching only hidden objects
    const hiddenQuery = showHidden ? '' : '&result.hidden=false';

    const url = `${envUrl}/${SEARCH_ENDPOINT}?limit=${limit}&offset=${offset}&type=${typeQuery}&getAncestors=${getAncestors}${hiddenQuery}`;
    return request
      .get(url)
      .set('x-mstr-authtoken', authToken)
      .set('x-mstr-projectid', projectId)
      .withCredentials()
      .then(({ body }) => {
        const totalItems = this.processTotalItems(body);
        if (totalItems > offset + limit) {
          offset += limit;
          queue.enqueue(callback(body));
          return this.fetchObjectListByProject({
            requestParams, callback, offset, limit
          }, projectId, queue);
        }

        return callback(body);
      });
  }

  /**
   * Fetches all items from every (selected) project, once response is received -
   * it is added to the queue to be cached
   *
   * @export
   * @param {Function} callback - function that adds objects to cache
   * @returns {Promise}
   */
  fetchObjectListForSelectedProjects = async (callback) => {
    const requestParams = this.getRequestParams();
    const projects = await this.getProjectDictionary();
    const projectIds = Object.keys(projects);
    const queue = new Queue(callback);
    const promiseList = [];
    console.time('Fetching environment objects');
    for (const id of projectIds) {
      const promise = this.fetchObjectListByProject({ requestParams }, id, queue)
        .then((promiseResult) => queue.enqueue(promiseResult));
      promiseList.push(promise);
    }
    return Promise.all(promiseList).then(() => {
      console.timeEnd('Fetching environment objects');
    });
  };

  /**
   * Fetches all objects available in my Library from MSTR API and filters out non-Dossier objects.
   *
   */
  fetchMyLibraryObjectList = (callback = (res) => res) => {
    const { envUrl, authToken } = this.getRequestParams();
    const url = `${envUrl}/${MY_LIBRARY_ENDPOINT}?outputFlag=FILTER_TOC`;
    return request
      .get(url)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res.body)
      .then(callback);
  };

  /**
   * Fetches all projects for the authenticated session.
   *
   * @param {Function} callback - Function to be applied to the returned response body
   * @returns
   */
  fetchProjects = (callback = (res) => res) => {
    const { envUrl, authToken } = this.getRequestParams();
    const url = `${envUrl}/${PROJECTS_ENDPOINT}`;
    return request
      .get(url)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res.body)
      .then(callback);
  };

  /**
   * Returns all objects available in my Library with filtered out non-Dossier objects.
   *
   */
  getMyLibraryObjectList = (callback = (res) => res) => {
    const cbFilter = (res) => callback(res.filter((object) => filterDossiersByViewMedia(object.target.viewMedia)));
    return this.fetchMyLibraryObjectList(cbFilter);
  };

  /**
 * Logic for fetching a list of objects (Reports, Datasets and Dossiers) from MSTR API.
 * It takes a function that will be called when the pagination promise resolves.
 *
 * @param {Function} callback - Function to be applied to the returned response body
 * @returns {Promise}
 * @export
 * @class getObjectList
 */
  // TODO: refactor when adding project selection
  getObjectList = (callback) => this.fetchObjectListForSelectedProjects(callback);
}

export const mstrListRestService = new MstrListRestService();
