import request from 'superagent';
import { reduxStore } from '../store';
import filterDossiersByViewMedia from '../helpers/viewMediaHelper';

const SEARCH_ENDPOINT = 'searches/results';
const LIMIT = 2048; // Don't use -1
const DOSSIER_SUBTYPE = 14081;
const SUBTYPES = [768, 769, 774, 776, 779, DOSSIER_SUBTYPE];

/**
 * Applies filtering function to body.result array of objects
 *
 * @param {Object} body - MSTR API response body
 * @returns {Array}
 */
export function filterDossier(body) {
  return body.result.filter(filterFunction);
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
 * @returns
 */
export function fetchTotalItems({ limit = 1, callback = processTotalItems, requestParams }) {
  return fetchObjectList({ limit, callback, requestParams });
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
  const total = await fetchTotalItems({ requestParams });

  let offset = 0;
  const promiseList = [];
  const paginationArgs = { limit: LIMIT, callback, requestParams };
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
    .then(filterDossier)
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
  return fetchObjectListPagination(callback);
}
