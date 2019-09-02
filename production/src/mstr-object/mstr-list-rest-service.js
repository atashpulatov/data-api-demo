import request from 'superagent';
import { reduxStore } from '../store';
import filterDossiersByViewMedia from '../helpers/viewMediaHelper';

const SEARCH_ENDPOINT = 'searches/results';
const LIMIT = 2048;


function filterDossier(arr) {
  return arr.filter((obj) => filterDossiersByViewMedia(obj.viewMedia)); // continue working somewhere here...
}
export function fetchObjectList({
  types, callback = (res) => res, offset = 0, limit = LIMIT,
}) {
  const { sessionReducer } = reduxStore.getState();
  const { envUrl, authToken } = sessionReducer;
  const typeQuery = types.join('&type=');
  const url = `${envUrl}/${SEARCH_ENDPOINT}?limit=${limit}&offset=${offset}&type=${typeQuery}`;

  return request
    .get(url)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
    .then((resbody) => { if (limit !== 1) { return filterDossier(resbody.result); } return resbody.result; })
    .then((x) => { console.log(x); return x; })
    .then(callback);
}


export default async function getObjectList(types, callback) {
  let offset = 0;
  const promiseList = [];
  const initialArgs = { types, limit: 1, callback: (res) => res.totalItems };
  const paginationArgs = {
    types, limit: LIMIT, callback,
  };
  const total = await fetchObjectList(initialArgs);
  while (offset <= total) {
    promiseList.push(fetchObjectList({ ...paginationArgs, offset }));
    offset += LIMIT;
  }
  console.log(promiseList);
  return promiseList;
}


export async function test() {
  getObjectList([14081, 768, 769, 774, 776, 779]);
}
