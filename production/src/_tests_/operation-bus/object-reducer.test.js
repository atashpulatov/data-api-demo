import { IMPORT_REQUESTED } from '../../operation/operation-actions';
import { objectReducer } from '../../operation/object-reducer';
import { UPDATE_OBJECT } from '../../operation/object-actions';

describe('objectReducer', () => {
  const initialObject = {
    objectWorkingId: 'someStringId123',
    envUrl: 'someURL',
    objectId: 'someId',
  };
  const initialState = [];
  describe('importRequested', () => {
    it('should add first object to array and return new array', () => {
      // given
      const action = {
        type: IMPORT_REQUESTED,
        payload: initialObject,
      };
      // when
      const resultState = objectReducer(initialState, action);
      // then
      expect(resultState).toEqual([initialObject]);
    });
    it('should add object to array and return new array', () => {
      // given
      const action = {
        type: IMPORT_REQUESTED,
        payload: initialObject,
      };
      const modifiedInitialState = [{
        objectWorkingId: 'someOtherString234',
        envUrl: 'someURL24',
        objectId: 'someDiffId',
      }];
      // when
      const resultState = objectReducer(modifiedInitialState, action);
      // then
      expect(resultState).toEqual([...modifiedInitialState, initialObject]);
    });
  });
  describe('updateObject', () => {
    it('should return same array if element not found', () => {
      const objectName = 'someName';
      const modifiedInitialState = [{
        objectWorkingId: 'someOtherString234',
        envUrl: 'someURL24',
        objectId: 'someDiffId',
      }];
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString23', objectName },
      };
      // when
      const resultState = objectReducer(modifiedInitialState, action);
      // then
      expect(resultState).toEqual(modifiedInitialState);
    });
    it('should add one property to object on single element array', () => {
      // given
      const objectName = 'someName';
      const modifiedInitialState = [{
        objectWorkingId: 'someOtherString234',
        envUrl: 'someURL24',
        objectId: 'someDiffId',
      }];
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString234', objectName },
      };
      // when
      const resultState = objectReducer(modifiedInitialState, action);
      // then
      expect(resultState[0]).toEqual({ ...modifiedInitialState[0], objectName });
    });
    it('should add two properties to object on single element array', () => {
      // given
      const objectName = 'someName';
      const someProp = 'someProp';
      const modifiedInitialState = [{
        objectWorkingId: 'someOtherString234',
        envUrl: 'someURL24',
        objectId: 'someDiffId',
      }];
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString234', objectName, someProp },
      };
      // when
      const resultState = objectReducer(modifiedInitialState, action);
      // then
      expect(resultState[0]).toEqual({ ...modifiedInitialState[0], objectName, someProp });
    });
    it('should add one property to object on multi element array', () => {
      // given
      const objectName = 'someName';
      const modifiedInitialState = [{
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
      }];
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString23', objectName },
      };
      // when
      const resultState = objectReducer(modifiedInitialState, action);
      // then
      expect(resultState[1]).toEqual({ ...modifiedInitialState[1], objectName });
    });
    it('should add two properties to object on multi element array', () => {
      // given
      const objectName = 'someName';
      const someProp = 'someProp';
      const modifiedInitialState = [{
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
      }];
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'someOtherString23', objectName, someProp },
      };
      // when
      const resultState = objectReducer(modifiedInitialState, action);
      // then
      expect(resultState[1]).toEqual({ ...modifiedInitialState[1], objectName, someProp });
    });
  });
  describe('getObjectData', () => {

  });
  describe('deleteObject', () => {

  });
});
