import {
  ObjectActionTypes,
  ObjectState,
  RemoveObjectAction,
  UpdateObjectAction,
} from './object-reducer-types';

import { OperationTypes } from '../../operation/operation-type-names';
import { objectReducer } from './object-reducer';

describe('objectReducer', () => {
  const initialObject = {
    objectWorkingId: 'someStringId123',
    envUrl: 'someURL',
    objectId: 'someId',
    importType: 'table',
  };
  const initialState: any = {
    empty: { objects: [] },
    singleObject: {
      objects: [
        {
          objectWorkingId: 2137,
          envUrl: 'someURL24',
          objectId: 'someDiffId',
        },
      ],
    },
    multipleObjects: {
      objects: [
        {
          objectWorkingId: 1,
          envUrl: 'someURL24',
          objectId: 'someDiffId',
        },
        {
          objectWorkingId: 2,
          envUrl: 'someURL24',
          objectId: 'someDiffId',
        },
        {
          objectWorkingId: 2137,
          envUrl: 'someURL24',
          objectId: 'someDiffId',
        },
      ],
    },
  };

  it('should have default state if provided undefined', () => {
    // given
    const unhandledAction: any = { type: 'some action' };

    // when
    const resultState = objectReducer(undefined, unhandledAction);

    // then
    expect(resultState).toEqual({ objects: [] });
  });

  it('should return the same state if action not handled by reducer', () => {
    // given
    const unhandledAction: any = { type: 'some action' };

    // when
    const resultState = objectReducer(initialState.multipleObjects, unhandledAction);

    // then
    expect(resultState).toBe(initialState.multipleObjects);
  });

  describe('importRequested and duplicateRequested', () => {
    it('should add first object to array and return new array', () => {
      // given
      const action: any = {
        type: OperationTypes.IMPORT_OPERATION,
        payload: { object: initialObject },
      };

      // when
      const resultState = objectReducer(initialState.empty, action);

      // then
      expect(resultState).toEqual({ objects: [initialObject] });
    });

    it.each`
      actionType
      ${OperationTypes.IMPORT_OPERATION}
      ${OperationTypes.DUPLICATE_OPERATION}
    `('should add object to array and return new array', ({ actionType }) => {
      // given
      const action: any = {
        type: actionType,
        payload: { object: initialObject },
      };

      // when
      const resultState = objectReducer(initialState.singleObject, action);

      // then
      expect(resultState).toEqual({
        objects: [initialObject, ...initialState.singleObject.objects],
      });
    });
  });

  describe('updateObject', () => {
    it('should throw error if element with id does not exist', () => {
      // given
      const objectName = 'someName';
      const action: UpdateObjectAction = {
        type: ObjectActionTypes.UPDATE_OBJECT,
        payload: { objectWorkingId: 123, objectName },
      };

      // when
      const throwingCall = (): ObjectState => objectReducer(initialState.singleObject, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('should add one property to object on single element array', () => {
      // given
      const objectName = 'someName';
      const action: UpdateObjectAction = {
        type: ObjectActionTypes.UPDATE_OBJECT,
        payload: { objectWorkingId: 2137, objectName },
      };

      // when
      const resultState = objectReducer(initialState.singleObject, action);

      // then
      expect(resultState.objects[0]).toEqual({
        ...initialState.singleObject.objects[0],
        objectName,
      });
    });

    it('should add two properties to object on single element array', () => {
      // given
      const objectName = 'someName';
      const someProp = 'someProp';
      const action: UpdateObjectAction = {
        type: ObjectActionTypes.UPDATE_OBJECT,
        payload: {
          objectWorkingId: 2137,
          objectName,
          someProp,
        },
      };

      // when
      const resultState = objectReducer(initialState.singleObject, action);

      // then
      expect(resultState.objects[0]).toEqual({
        ...initialState.singleObject.objects[0],
        objectName,
        someProp,
      });
    });

    it('should add one property to object on multi element array', () => {
      // given
      const objectName = 'someName';
      const action: UpdateObjectAction = {
        type: ObjectActionTypes.UPDATE_OBJECT,
        payload: { objectWorkingId: 2, objectName },
      };

      // when
      const resultState = objectReducer(initialState.multipleObjects, action);

      // then
      expect(resultState.objects[1]).toEqual({
        ...initialState.multipleObjects.objects[1],
        objectName,
      });
    });

    it('should add two properties to object on multi element array', () => {
      // given
      const objectName = 'someName';
      const someProp = 'someProp';
      const action: UpdateObjectAction = {
        type: ObjectActionTypes.UPDATE_OBJECT,
        payload: { objectWorkingId: 2, objectName, someProp },
      };

      // when
      const resultState = objectReducer(initialState.multipleObjects, action);

      // then
      expect(resultState.objects[1]).toEqual({
        ...initialState.multipleObjects.objects[1],
        objectName,
        someProp,
      });
    });
  });

  describe('deleteObject', () => {
    it('should throw error if object does not exist in array', () => {
      // given
      const someId = 123;
      const action: RemoveObjectAction = {
        type: ObjectActionTypes.REMOVE_OBJECT,
        payload: someId,
      };

      // when
      const throwingCall = (): ObjectState => objectReducer(initialState.empty, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('should remove object if id exists in array', () => {
      // given
      const someId = 2;
      const action: RemoveObjectAction = {
        type: ObjectActionTypes.REMOVE_OBJECT,
        payload: someId,
      };

      // when
      const resultState = objectReducer(initialState.multipleObjects, action);

      // then
      expect(resultState.objects).toHaveLength(2);
    });

    it('should remove last object if id exists in array', () => {
      // given
      const someId = 2137;
      const action: any = {
        type: ObjectActionTypes.REMOVE_OBJECT,
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
      const action: any = {
        type: ObjectActionTypes.RESTORE_ALL_OBJECTS,
        payload,
      };

      // when
      const resultState = objectReducer(initialState.singleObject, action);

      // then
      expect(resultState.objects).toEqual(payload);
    });
  });
});
