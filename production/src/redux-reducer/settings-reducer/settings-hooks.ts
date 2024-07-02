import { useSelector } from 'react-redux';

import { ObjectData } from '../../types/object-types';

import { settingsReducerSelectors } from './settings-reducer-selectors';

/**
 * Retrieves a filtered list of objects for the side panel details based on the provided settings.
 * @param objects - The list of objects to filter.
 * @returns The filtered list of objects for the side panel details.
 */
export const useGetFilteredObjectListForSidePanelDetails = (
  objects: ObjectData[]
): ObjectData[] => {
  const sidePanelDetailsSettings = useSelector(
    settingsReducerSelectors.selectSidePanelObjectInfoSettings
  );

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
