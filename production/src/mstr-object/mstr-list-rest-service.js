/**
 * Logic for fetching of single list of objects (Reports, Datasets and Dossiers) from MSTR API
 *
 * @export
 * @class getObjectList
 */

import request from 'superagent';
import { reduxStore } from '../store';
import filterDossiersByViewMedia from '../helpers/viewMediaHelper';

const SEARCH_ENDPOINT = 'searches/results';
const LIMIT = 2048; // 2048; Don't use -1
const DOSSIER_SUBTYPE = 14081;
const SUBTYPES = [768, 769, 774, 776, 779, DOSSIER_SUBTYPE];

/**
 * Applies filtering function to body.result array of objects
 *
 * @param {Object} body - MSTR API response body
 * @returns {Array}
 */
function filterDossier(body) {
  return body.result.filter(filterFunction);
}

/**
 * Uses imported helper function to check whether object is a Dossier, but only if it is the same subtype as Dossier
 *
 * @param {Object} object -
 * @returns {Boolean}
 */
function filterFunction(object) {
  if (object.subtype === DOSSIER_SUBTYPE) {
    return filterDossiersByViewMedia(object.viewMedia);
  }
  return true;
}

function processTotalItems(body) {
  return body.totalItems;
}

function getRequestParams() {
  const { sessionReducer } = reduxStore.getState();
  const { envUrl, authToken } = sessionReducer;
  const typeQuery = SUBTYPES.join('&type=');
  return { envUrl, authToken, typeQuery };
}

function fetchTotalItems({ limit = 1, callback = processTotalItems, requestParams }) {
  return fetchObjectList({ limit, callback, requestParams });
}

/**
 * Uses request with limit of 1 to check for total number of objects of given subtypes and then
 * executes multiple requests to API to apply pagination.
 *
 * @param {Function} callback - function to be passed to fetchObjectList method
 * @returns {Array} of promises
 */
async function fetchObjectListPagination(callback) {
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
function fetchObjectList({ requestParams, callback = (res) => res, offset = 0, limit = LIMIT }) {
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
 *
 *
 * @export
 * @returns {Promise} A promise
 */
export default function getObjectList(callback) {
  return fetchObjectListPagination(callback);
}
