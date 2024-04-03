import { ObjectData } from '../types/object-types';

/**
 * Adds groupData prop, which is required for proper grouping, to each object in the array
 * @param loadedObjects Contains all object currently existing in redux
 * @returns Array of objects with added groupData prop
 */
export const injectGroupDataToObjects = (loadedObjects: ObjectData[]): ObjectData[] =>
  loadedObjects.map(object => {
    const groupData = {
      key: object.worksheet?.index || -1,
      title: object.worksheet?.name || '',
    };

    return {
      ...object,
      groupData,
    };
  });
