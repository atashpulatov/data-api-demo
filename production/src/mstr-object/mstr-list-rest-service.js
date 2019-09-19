import request from 'superagent';
import { reduxStore } from '../store';
import filterDossiersByViewMedia from '../helpers/viewMediaHelper';

const SEARCH_ENDPOINT = 'searches/results';
const PROJECTS_ENDPOINT = 'projects';
const MY_LIBRARY_ENDPOINT = 'library';
const LIMIT = 4096;
const DOSSIER_SUBTYPE = 14081;
const SUBTYPES = [768, 769, 774, 776, 779, DOSSIER_SUBTYPE];

/**
 * Applies filtering function to body.result array of objects
 *
 * @param {Object} body - MSTR API response body
 * @returns {Array}
 */
export function filterDossier(body) {
  let result = '';
  let totalItems = '';
  if (body.result) {
    ({ result, totalItems } = body);
  } else {
    result = body;
    totalItems = body.length;
  }
  return { result: result.filter(filterFunction), totalItems };
}

/**
 * Uses imported helper function to check whether object is a Dossier, but only if it is the same subtype as Dossier
 *
 * @param {Object} object MicroStrategy Object (Resport, Dossier, Cube)
 * @returns {Boolean}
 */
export function filterFunction(object) {
  if (object.subtype === DOSSIER_SUBTYPE) {
    return filterDossiersByViewMedia(object.viewMedia);
  }
  return true;
}

/**
 * Extracts the totalItems value from the response body
 *
 * @param {*} body
 * @returns
 */
export function processTotalItems(body) {
  return body.totalItems;
}

/**
 * Creates the request parameters from redux state
 *
 * @returns
 */
export function getRequestParams() {
  const { sessionReducer } = reduxStore.getState();
  const { envUrl, authToken } = sessionReducer;
  const typeQuery = SUBTYPES.join('&type=');
  return { envUrl, authToken, typeQuery };
}

/**
 * Get the totalItems value by fetching only 1 object.
 *
 * @param {Object} { limit = 1, callback = processTotalItems, requestParams }
 * @returns {Array} [totalItems, Promise]
 */
export function fetchTotalItems({ limit = LIMIT, callback, requestParams }) {
  const totalItemsCallback = (body) => {
    const filtered = filterDossier(body);
    return [filtered.totalItems, callback(filtered)];
  };
  return fetchObjectList({ limit, callback: totalItemsCallback, requestParams });
}

/**
 * Get a projects dictionary with key:value {id:name} pairs
 *
 * @returns {Object} {ProjetId: projectName}
 */
export function getProjectDictionary() {
  return fetchProjects()
    .then((projects) => projects.reduce((dict, project) => ({ ...dict, [project.id]: project.name || '' }), {}));
}

/**
 * Uses request with limit of 1 to check for total number of objects of given subtypes and then
 * executes multiple requests to API to apply pagination.
 *
 * @param {Function} callback - function to be passed to fetchObjectList method
 * @returns {Array} of promises
 */
export async function fetchObjectListPagination(callback) {
  const requestParams = getRequestParams();
  const paginationArgs = { callback, requestParams };
  const [total, promise] = await fetchTotalItems(paginationArgs);
  const promiseList = [promise];
  let offset = LIMIT;
  while (offset <= total) {
    promiseList.push(fetchObjectList({ ...paginationArgs, offset }));
    offset += LIMIT;
  }
  return promiseList;
}

/**
 * Fetches object of given subtypes from MSTR API.
 *
 * @param {Object} { requestParams, callback = (res) => res, offset = 0, limit = LIMIT }
 * @param {Object} requestParams - Object containing environment url, authToken and
 * subtypes of objects, for which to execute the request
 * @param {Function} callback - Function to be applied to the returned response body
 * @param {number} offset - Starting index of object to be fetched
 * @param {number} limit - Number of objects to be fetched per request
 * @returns
 */
export function fetchObjectList({ requestParams, callback = (res) => res, offset = 0, limit = LIMIT }) {
  const { envUrl, authToken, typeQuery } = requestParams;
  const url = `${envUrl}/${SEARCH_ENDPOINT}?limit=${limit}&offset=${offset}&type=${typeQuery}`;
  return request
    .get(url)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
    .then(callback);
}

/**
 * Fetches all objects available in my Library from MSTR API and filters out non-Dossier objects.
 *
 */
export function fetchMyLibraryObjectList({ requestParams, callback = (res) => res }) {
  const { envUrl, authToken } = requestParams;
  const url = `${envUrl}/${MY_LIBRARY_ENDPOINT}`;
  return request
    .get(url)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
    .then(callback);
}

/**
 * Creates multiple API requests if necessary for pagination
 *
 */
export async function fetchMyLibraryObjectListPagination(callback) {
  const requestParams = getRequestParams();
  const paginationArgs = { callback, requestParams };
  const promiseList = [];
  promiseList.push(fetchMyLibraryObjectList({ ...paginationArgs }));
  return promiseList;
}

/**
 * Returns all objects available in my Library with filtered out non-Dossier objects.
 *
 */
export function getMyLibraryObjectList(callback = (res) => res) {
  const cbFilter = (res) => callback(filterDossier(res).result);
  return fetchMyLibraryObjectListPagination(cbFilter);
}

/**
 * Fetches all projects for the authenticated session.
 *
 * @param {Function} callback - Function to be applied to the returned response body
 * @returns
 */
export function fetchProjects(callback = (res) => res) {
  const { envUrl, authToken } = getRequestParams();
  const url = `${envUrl}/${PROJECTS_ENDPOINT}`;
  return request
    .get(url)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
    .then(callback);
}

/**
 * Logic for fetching a list of objects (Reports, Datasets and Dossiers) from MSTR API.
 * It takes a function that will be called when the pagination promise resolves.
 *
 * @param {Function} callback - Function to be applied to the returned response body
 * @export
 * @class getObjectList
 */
export default function getObjectList(callback) {
  const cbFilter = (res) => callback(filterDossier(res).result);
  return fetchObjectListPagination(cbFilter);
}
