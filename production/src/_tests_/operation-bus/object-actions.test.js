import {
  UPDATE_OBJECT, updateObject, DELETE_OBJECT, deleteObject, RESTORE_ALL_OBJECTS, restoreAllObjects
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

describe('deleteObject', () => {
  it('should populate action with proper fields', () => {
    // given
    const exampleObjectWorkingId = 'someId';
    const expectedAction = {
      type: DELETE_OBJECT,
      payload: exampleObjectWorkingId,
    };

    // when
    const resultAction = deleteObject(exampleObjectWorkingId);

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
