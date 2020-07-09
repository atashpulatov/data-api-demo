
export const UPDATE_OBJECT = 'OBJECT_UPDATE_OBJECT';

export const REMOVE_OBJECT = 'OBJECT_REMOVE_OBJECT';

export const RESTORE_ALL_OBJECTS = 'OBJECT_RESTORE_ALL_OBJECTS';

export const RESTORE_OBJECT_BACKUP = 'OBJECT_RESTORE_OBJECT_BACKUP';

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
