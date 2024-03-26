import { ObjectActionTypes } from './object-reducer-types';

import { removeObject, restoreAllObjects, updateObject } from './object-actions';

describe('updateObject', () => {
  it('should populate action with proper fields', () => {
    // given
    const exampleObject = {};
    const expectedAction = {
      type: ObjectActionTypes.UPDATE_OBJECT,
      payload: exampleObject,
    };

    // when
    const resultAction = updateObject(exampleObject);

    // then
    expect(resultAction).toEqual(expectedAction);
  });
});

describe('removeObject', () => {
  it('should populate action with proper fields', () => {
    // given
    const exampleObjectWorkingId = 2137;
    const expectedAction = {
      type: ObjectActionTypes.REMOVE_OBJECT,
      payload: exampleObjectWorkingId,
    };

    // when
    const resultAction = removeObject(exampleObjectWorkingId);

    // then
    expect(resultAction).toEqual(expectedAction);
  });
});

describe('restoreAllObjects', () => {
  it('populates action with proper fields', () => {
    // given
    const objects: any = ['test'];
    const expectedAction = {
      type: ObjectActionTypes.RESTORE_ALL_OBJECTS,
      payload: objects,
    };

    // when
    const resultAction = restoreAllObjects(objects);

    // then
    expect(resultAction).toEqual(expectedAction);
  });
});
