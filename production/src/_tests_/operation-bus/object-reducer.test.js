import { IMPORT_REQUESTED } from '../../operation/operation-actions';
import { objectReducer } from '../../operation/object-reducer';
import { UPDATE_OBJECT } from '../../operation/object-actions';

describe('objectReducer', () => {
  const initialObject = {
    objectWorkingId: 'someStringId123',
    envUrl: 'someURL',
    objectId: 'someId',
  };
  const initialState = {
    empty: [],
    singleObject:[{
      objectWorkingId: 'someOtherString234',
      envUrl: 'someURL24',
      objectId: 'someDiffId',
    }],
    multipleObjects:   [{
      objectWorkingId: 'someOtherString2',
      envUrl: 'someURL24',
      objectId: 'someDiffId',
    },
    {
      objectWorkingId: 'someOtherString23',
      envUrl: 'someURL24',
      objectId: 'someDiffId',
    },
    {
      objectWorkingId: 'someOtherString234',
      envUrl: 'someURL24',
      objectId: 'someDiffId',
    }]
  };
  describe('importRequested', () => {
    it('should add first object to array and return new array', () => {
      // given
      const action = {
        type: IMPORT_REQUESTED,
        payload: { object: initialObject, }
      };
      // when
      const resultState = objectReducer(initialState.empty, action);
      // then
      expect(resultState).toEqual([initialObject]);
    });
    it('should add object to array and return new array', () => {
      // given
      const action = {
        type: IMPORT_REQUESTED,
        payload: { object: initialObject, }
      };
      // when
      const resultState = objectReducer(initialState.singleObject, action);
      // then
      expect(resultState).toEqual([...initialState.singleObject, initialObject]);
    });
  });
  describe('updateObject', () => {
    it('should return same array if element not found', () => {
      const objectName = 'someName';
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString23', objectName },
      };
      // when
      const resultState = objectReducer(initialState.singleObject, action);
      // then
      expect(resultState).toEqual(initialState.singleObject);
    });
    it('should add one property to object on single element array', () => {
      // given
      const objectName = 'someName';
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString234', objectName },
      };
      // when
      const resultState = objectReducer(initialState.singleObject, action);
      // then
      expect(resultState[0]).toEqual({ ...initialState.singleObject[0], objectName });
    });
    it('should add two properties to object on single element array', () => {
      // given
      const objectName = 'someName';
      const someProp = 'someProp';
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString234', objectName, someProp },
      };
      // when
      const resultState = objectReducer(initialState.singleObject, action);
      // then
      expect(resultState[0]).toEqual({ ...initialState.singleObject[0], objectName, someProp });
    });
    it('should add one property to object on multi element array', () => {
      // given
      const objectName = 'someName';

      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString23', objectName },
      };
      // when
      const resultState = objectReducer(initialState.multipleObjects, action);
      // then
      expect(resultState[1]).toEqual({ ...initialState.multipleObjects[1], objectName });
    });
    it('should add two properties to object on multi element array', () => {
      // given
      const objectName = 'someName';
      const someProp = 'someProp';
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString23', objectName, someProp },
      };
      // when
      const resultState = objectReducer(initialState.multipleObjects, action);
      // then
      expect(resultState[1]).toEqual({ ...initialState.multipleObjects[1], objectName, someProp });
    });
  });
  describe('getObjectData', () => {
    
  });
  describe('deleteObject', () => {

  });
});
