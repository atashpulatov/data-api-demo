import { useSelector } from 'react-redux';

import { ObjectData } from '../../types/object-types';
import { ObjectInfoSetting } from './settings-reducer-types';

import { settingsReducerSelectors } from './settings-reducer-selectors';

/**
 * Renames the keys of the given detailsSettings array based on specific mappings.
 * @param detailsSettings - The array of ObjectInfoSetting objects to be processed.
 * @returns The updated array of ObjectInfoSetting objects with renamed keys.
 */
const renameSettingsKeys = (detailsSettings: ObjectInfoSetting[]): ObjectInfoSetting[] =>
  detailsSettings.map(setting => {
    switch (setting.key) {
      case 'location':
        return { ...setting, key: 'ancestors' };
      case 'filter':
        return { ...setting, key: 'filters' };
      case 'dateModified':
        return { ...setting, key: 'modifiedDate' };
      case 'dateCreated':
        return { ...setting, key: 'createdDate' };
      default:
        return setting;
    }
  });

/**
 * Retrieves the side panel details settings from the Redux store and renames the keys.
 * @returns An array of ObjectInfoSetting objects.
 */
const useGetSidePanelDetailsSettings = (): ObjectInfoSetting[] => {
  const sidePanelDetailsSettings = useSelector(
    settingsReducerSelectors.selectSidePanelObjectInfoSettings
  );
  return renameSettingsKeys(sidePanelDetailsSettings);
};

/**
 * Retrieves a filtered list of objects for the side panel details based on the provided settings.
 * @param objects - The list of objects to filter.
 * @returns The filtered list of objects for the side panel details.
 */
export const useGetFilteredObjectListForSidePanelDetails = (objects: ObjectData[]): ObjectData[] => {
  const sidePanelDetailsSettings = useGetSidePanelDetailsSettings();

  const disabledSidePanelDetailsSettings = sidePanelDetailsSettings.filter(
    setting => !setting.toggleChecked
  );
  const disabledSidePanelDetailsSettingsKeys = disabledSidePanelDetailsSettings.map(
    setting => setting.key
  );

  return objects.map(object => {
    const copiedObject = JSON.parse(JSON.stringify(object));

    disabledSidePanelDetailsSettingsKeys.forEach(key => {
      if (key === 'id') {
        delete copiedObject.objectId;
      } else if (copiedObject.details) {
        delete copiedObject.details[key];
      }
    });

    return { ...object, details: copiedObject.details, objectId: copiedObject.objectId };
  });
};

