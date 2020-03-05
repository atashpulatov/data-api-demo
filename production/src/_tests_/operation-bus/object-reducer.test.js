import { IMPORT_REQUESTED } from '../../operation/operation-actions';
import { objectReducer } from '../../operation/object-reducer';

describe('objectReducer', () => {
  describe('importRequested', () => {
    const initialObject = {
      objectWorkingId: 'someStringId123',
      envUrl: 'someURL',
      objectId: 'someId',
    };
    const initialState = [];
    it('should add object to array and return new array', () => {
      // given
      const action = {
        type: IMPORT_REQUESTED,
        payload: initialObject,
      };
      // when
      const resultState = objectReducer(initialState, action);
      // then
    });
  });
  describe('updateObject', () => {

  });
  describe('getObjectData', () => {

  });
  describe('deleteObject', () => {

  });
});
