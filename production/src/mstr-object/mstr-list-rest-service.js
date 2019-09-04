import request from 'superagent';
import { reduxStore } from '../store';
import filterDossiersByViewMedia from '../helpers/viewMediaHelper';

const SEARCH_ENDPOINT = 'searches/results';
const LIMIT = 2048; // 2048; Don't use -1
const DOSSIER_SUBTYPE = 14081;
const SUBTYPES = [768, 769, 774, 776, 779, DOSSIER_SUBTYPE];

/**
 * TODO
 *
 * @param {*} body
 * @returns
 */
function filterDossier(body) {
  // TODO what if there is no body.result
  return body.result.filter(filterFunction);
}

function filterFunction(object) {
  if (object.subtype === DOSSIER_SUBTYPE) {
    return filterDossiersByViewMedia(object.viewMedia);
  }
  return true;
}

function processTotalItems(body) {
  // TODO what if there is no totalItems
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

function fetchObjectList({ requestParams, callback = (res) => res, offset = 0, limit = LIMIT }) {
  const { envUrl, authToken, typeQuery } = requestParams;
  const url = `${envUrl}/${SEARCH_ENDPOINT}?limit=${limit}&offset=${offset}&type=${typeQuery}`;
  return request
    .get(url)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
    .then(callback);
}

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


export default function getObjectList() {
  return fetchObjectListPagination(filterDossier);
}
