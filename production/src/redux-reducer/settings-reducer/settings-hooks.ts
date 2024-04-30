import { useSelector } from 'react-redux';

import { ObjectData, WorksheetObjectDetails } from '../../types/object-types';
import { ObjectInfoSetting } from './settings-reducer-types';

import { selectObjects } from '../object-reducer/object-reducer-selectors';
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
 * Retrieves the worksheet details settings from the Redux store.
 * @returns An array of ObjectInfoSetting objects representing the worksheet details settings.
 */
const useGetWorksheetDetailsSettings = (): ObjectInfoSetting[] => {
  const worksheetDetailsSettings = useSelector(
    settingsReducerSelectors.selectWorksheetObjectInfoSettings
  );
  return renameSettingsKeys(worksheetDetailsSettings);
};

const useGetObjects = (): ObjectData[] => useSelector(selectObjects);

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

// TODO: This should not be hook. Move it to utils and call it during inserting object details to worksheet
export const useGetObjectDetailsForWorksheetDetails = (): Partial<WorksheetObjectDetails>[] => {
  const worksheetDetailsSettings = useGetWorksheetDetailsSettings();
  const objects = useGetObjects();

  const enabledWorksheetDetailsSettings = worksheetDetailsSettings.filter(
    setting => setting.toggleChecked
  );
  const enabledWorksheetDetailsSettingsKeys = enabledWorksheetDetailsSettings.map(
    setting => setting.key
  );

  const filteredObjectDetails = objects.map(object => {
    const filteredSingleObjectDetails: Partial<WorksheetObjectDetails> = {};
    enabledWorksheetDetailsSettingsKeys.forEach(key => {
      switch (key) {
        case 'name':
          filteredSingleObjectDetails[key] = object.name;
          break;
        case 'id':
          filteredSingleObjectDetails[key] = object.objectId;
          break;
        case 'pageBy':
          filteredSingleObjectDetails[key] = object.pageByData;
          break;
        default:
          filteredSingleObjectDetails[key] = object.details[key];
      }
    });
    return filteredSingleObjectDetails;
  });
  return filteredObjectDetails;
};
