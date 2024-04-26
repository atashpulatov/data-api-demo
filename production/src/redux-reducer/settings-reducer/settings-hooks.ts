import { useSelector } from 'react-redux';

import { ObjectData, WorksheetObjectDetails } from '../../types/object-types';
import { ObjectInfoSetting } from './settings-reducer-types';

import { selectObjects } from '../object-reducer/object-reducer-selectors';
import { settingsReducerSelectors } from './settings-reducer-selectors';

const renameSettingsKeys = (detailsSettings: ObjectInfoSetting[]): ObjectInfoSetting[] =>
  detailsSettings.map(setting => {
    if (setting.key === 'location') {
      return { ...setting, key: 'ancestors' };
    }
    if (setting.key === 'filter') {
      return { ...setting, key: 'filters' };
    }
    return setting;
  });

const useGetSidePanelDetailsSettings = (): ObjectInfoSetting[] => {
  const sidePanelDetailsSettings = useSelector(
    settingsReducerSelectors.selectSidePanelObjectInfoSettings
  );
  return renameSettingsKeys(sidePanelDetailsSettings);
};

const useGetWorksheetDetailsSettings = (): ObjectInfoSetting[] => {
  const worksheetDetailsSettings = useSelector(
    settingsReducerSelectors.selectWorksheetObjectInfoSettings
  );
  return renameSettingsKeys(worksheetDetailsSettings);
};

const useGetObjects = (): ObjectData[] => useSelector(selectObjects);

export const useGetFilteredObjectListForSidePanelDetails = (): Partial<ObjectData>[] => {
  const sidePanelDetailsSettings = useGetSidePanelDetailsSettings();
  const objects = useGetObjects();

  const disabledSidePanelDetailsSettings = sidePanelDetailsSettings.filter(
    setting => !setting.toggleChecked
  );
  const disabledSidePanelDetailsSettingsKeys = disabledSidePanelDetailsSettings.map(
    setting => setting.key
  );

  const filteredObjects = objects.map(object => {
    const filteredObject = { ...object };
    disabledSidePanelDetailsSettingsKeys.forEach(key => {
      if (key === 'id') {
        delete filteredObject.objectId;
      } else {
        delete filteredObject.details[key];
      }
    });
    return filteredObject;
  });
  return filteredObjects;
};

export const useGetObjectDetailsForWorksheetDetails = (): Partial<WorksheetObjectDetails>[] => {
  const sidePanelDetailsSettings = useGetWorksheetDetailsSettings();
  const objects = useGetObjects();

  const enabledSidePanelDetailsSettings = sidePanelDetailsSettings.filter(
    setting => setting.toggleChecked
  );
  const enabledSidePanelDetailsSettingsKeys = enabledSidePanelDetailsSettings.map(
    setting => setting.key
  );

  const filteredObjectDetails = objects.map(object => {
    const filteredSingleObjectDetails: Partial<WorksheetObjectDetails> = {};
    enabledSidePanelDetailsSettingsKeys.forEach(key => {
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
