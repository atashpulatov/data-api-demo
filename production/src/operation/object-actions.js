
export const UPDATE_OBJECT = 'UPDATE_OBJECT';

export const GET_OBJECT_DATA = 'GET_OBJECT_DATA';
export const DELETE_OBJECT = 'DELETE_OBJECT';

export const updateObject = (updatedObject) => ({
  type: UPDATE_OBJECT,
  payload: updatedObject
});

export const getObjectData = (objectWorkingId) => ({
  type: GET_OBJECT_DATA,
  payload: objectWorkingId,
});

export const deleteObject = (objectWorkingId) => ({
  type: DELETE_OBJECT,
  payload: objectWorkingId,
});
