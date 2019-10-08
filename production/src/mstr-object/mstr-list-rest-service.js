import request from 'superagent';
import { reduxStore } from '../store';
import filterDossiersByViewMedia from '../helpers/viewMediaHelper';

const SEARCH_ENDPOINT = 'searches/results';
const PROJECTS_ENDPOINT = 'projects';
const MY_LIBRARY_ENDPOINT = 'library';
const LIMIT = 7000;
const DOSSIER_SUBTYPE = 14081;
const SUBTYPES = [768, 769, 774, 776, 779, DOSSIER_SUBTYPE];

/**
 * Applies filtering function to body.result array of objects
 *
 * @param {Object} body - MSTR API response body
 * @returns {Array}
 */
export function filterDossier(body) {
  const { result } = body;
  return result.filter(filterFunction);
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
export function fetchTotalItems({ limit = LIMIT, callback = (res) => res, requestParams }) {
  const totalItemsCallback = (body) => {
    callback(filterDossier(body));
    return processTotalItems(body);
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
  console.time('Fetching first batch of objects');
  const total = await fetchTotalItems({ requestParams, callback, limit: 1000 });
  console.timeEnd('Fetching first batch of objects');
  const promiseList = [];
  let offset = 1000;
  console.time('Fetching environment objects');
  while (offset <= total) {
    const promise = fetchObjectList({ requestParams, offset });
    promiseList.push(promise);
    const results = await promise;
    callback(results);
    offset += LIMIT;
  }
  return Promise.all(promiseList).then(() => {
    console.timeEnd('Fetching environment objects');
    // const flatObjects = Array.prototype.concat.apply([], objects);
    // return callback(flatObjects);
  });
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
export function fetchObjectList({ requestParams, callback = filterDossier, offset = 0, limit = LIMIT }) {
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
export function fetchMyLibraryObjectList(callback = (res) => res) {
  const { envUrl, authToken } = getRequestParams();
  const url = `${envUrl}/${MY_LIBRARY_ENDPOINT}?outputFlag=FILTER_TOC`;
  return request
    .get(url)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
    .then(callback);
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
 * Returns all objects available in my Library with filtered out non-Dossier objects.
 *
 */
export function getMyLibraryObjectList(callback = (res) => res) {
  const cbFilter = (res) => callback(res.filter((object) => filterDossiersByViewMedia(object.target.viewMedia)));
  return fetchMyLibraryObjectList(cbFilter);
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
  return fetchObjectListPagination(callback);
}
