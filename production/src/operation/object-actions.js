
export const UPDATE_OBJECT = 'UPDATE_OBJECT';

export const DELETE_OBJECT = 'DELETE_OBJECT';

export const RESTORE_ALL_OBJECTS = 'RESTORE_ALL_OBJECTS';

export const updateObject = (updatedObject) => ({
  type: UPDATE_OBJECT,
  payload: updatedObject
});

export const deleteObject = (objectWorkingId) => ({
  type: DELETE_OBJECT,
  payload: objectWorkingId,
});

export const restoreAllObjects = (objects) => ({
  type: RESTORE_ALL_OBJECTS,
  payload: objects
});
