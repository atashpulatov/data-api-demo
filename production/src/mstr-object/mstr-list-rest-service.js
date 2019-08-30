import request from 'superagent';
import { reduxStore } from '../store';

const SEARCH_ENDPOINT = 'searches/results';
const LIMIT = 2048;


export function fetchObjectList({
  types, cb = (res) => res, offset = 0, limit = LIMIT,
}) {
  const { sessionReducer } = reduxStore.getState();
  const { envUrl, authToken } = sessionReducer;
  const typeQuery = types.join('&type');
  const url = `${envUrl}/${SEARCH_ENDPOINT}?limit=${limit}&offset=${offset}&type=${typeQuery}`;

  return request
    .get(url)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
    .then(cb);
}


export default async function getObjectList(types) {
  let fetched;
  const offset = 0;
  const totalParam = { types, limit: 1, cb: (res) => res.totalItems };
  const total = await fetchObjectList(totalParam);
}


export function test() {
  console.time('start');
  getObjectList([768, 769, 774, 776, 779, 14081]);
  console.timeEnd('start');
}
