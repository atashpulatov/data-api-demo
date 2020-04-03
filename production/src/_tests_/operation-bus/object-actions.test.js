import {
  UPDATE_OBJECT, updateObject, REMOVE_OBJECT, removeObject, RESTORE_ALL_OBJECTS, restoreAllObjects
} from '../../operation/object-actions';

describe('updateObject', () => {
  it('should populate action with proper fields', () => {
    // given
    const exampleObject = {};
    const expectedAction = {
      type: UPDATE_OBJECT,
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
    const exampleObjectWorkingId = 'someId';
    const expectedAction = {
      type: REMOVE_OBJECT,
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
    const objects = ['test'];
    const expectedAction = {
      type: RESTORE_ALL_OBJECTS,
      payload: objects,
    };

    // when
    const resultAction = restoreAllObjects(objects);

    // then
    expect(resultAction).toEqual(expectedAction);
  });
});
