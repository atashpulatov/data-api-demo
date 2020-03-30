import { IMPORT_REQUESTED } from '../../operation/operation-actions';
import { objectReducer } from '../../operation/object-reducer';
import { UPDATE_OBJECT, DELETE_OBJECT, RESTORE_ALL_OBJECTS } from '../../operation/object-actions';

describe('objectReducer', () => {
  const initialObject = {
    objectWorkingId: 'someStringId123',
    envUrl: 'someURL',
    objectId: 'someId',
  };
  const initialState = {
    empty: { objects: [] },
    singleObject: {
      objects: [{
        objectWorkingId: 'someOtherString234',
        envUrl: 'someURL24',
        objectId: 'someDiffId',
      }]
    },
    multipleObjects: {
      objects: [{
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
    }
  };

  it('should have default state if provided undefined', () => {
    // given
    const unhandledAction = { type: 'some action' };

    // when
    const resultState = objectReducer(undefined, unhandledAction);

    // then
    expect(resultState).toEqual({ objects: [] });
  });

  it('should return the same state if action not handled by reducer', () => {
    // given
    const unhandledAction = { type: 'some action' };

    // when
    const resultState = objectReducer(initialState.multipleObjects, unhandledAction);

    // then
    expect(resultState).toBe(initialState.multipleObjects);
  });

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
      expect(resultState).toEqual({ objects: [initialObject] });
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
      expect(resultState).toEqual({ objects: [initialObject, ...initialState.singleObject.objects] });
    });
  });

  describe('updateObject', () => {
    it('should throw error if element with id does not exist', () => {
      // given
      const objectName = 'someName';
      const action = {
        type: UPDATE_OBJECT,
        payload: { objectWorkingId: 'nonExistingId', objectName },
      };

      // when
      const throwingCall = () => objectReducer(initialState.singleObject, action);

      // then
      expect(throwingCall).toThrow();
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
      expect(resultState.objects[0]).toEqual({ ...initialState.singleObject.objects[0], objectName });
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
      expect(resultState.objects[0]).toEqual({ ...initialState.singleObject.objects[0], objectName, someProp });
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
      expect(resultState.objects[1]).toEqual({ ...initialState.multipleObjects.objects[1], objectName });
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
      expect(resultState.objects[1]).toEqual({ ...initialState.multipleObjects.objects[1], objectName, someProp });
    });
  });

  describe('deleteObject', () => {
    it('should throw error if object does not exist in array', () => {
      // given
      const someId = 'some id';
      const action = {
        type: DELETE_OBJECT,
        payload: someId,
      };

      // when
      const throwingCall = () => objectReducer(initialState.empty, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('should remove object if id exists in array', () => {
      // given
      const someId = 'someOtherString23';
      const action = {
        type: DELETE_OBJECT,
        payload: someId,
      };

      // when
      const resultState = objectReducer(initialState.multipleObjects, action);

      // then
      expect(resultState.objects).toHaveLength(2);
    });

    it('should remove last object if id exists in array', () => {
      // given
      const someId = 'someOtherString234';
      const action = {
        type: DELETE_OBJECT,
        payload: someId,
      };

      // when
      const resultState = objectReducer(initialState.singleObject, action);

      // then
      expect(resultState.objects).toHaveLength(0);
    });
  });

  describe('restoreAllObjects', () => {
    it('replaces objects in state on RESTORE_ALL_OBJECTS', () => {
      // given
      const payload = ['test'];
      const action = {
        type: RESTORE_ALL_OBJECTS,
        payload,
      };

      // when
      const resultState = objectReducer(initialState.singleObject, action);

      // then
      expect(resultState.objects).toEqual(payload);
    });
  });
});
