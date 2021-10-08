export const UPDATE_OBJECT = 'UPDATE_OBJECT';

export const REMOVE_OBJECT = 'REMOVE_OBJECT';

export const RESTORE_ALL_OBJECTS = 'RESTORE_ALL_OBJECTS';

export const RESTORE_OBJECT_BACKUP = 'RESTORE_OBJECT_BACKUP';

export const updateObject = (updatedObject) => ({
  type: UPDATE_OBJECT,
  payload: updatedObject
});

export const removeObject = (objectWorkingId) => ({
  type: REMOVE_OBJECT,
  payload: objectWorkingId,
});

export const restoreAllObjects = (objects) => ({
  type: RESTORE_ALL_OBJECTS,
  payload: objects
});

export const restoreObjectBackup = (backupObjectData) => ({
  type: RESTORE_OBJECT_BACKUP,
  payload: backupObjectData
});
