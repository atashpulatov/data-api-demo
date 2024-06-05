import { useSelector } from 'react-redux';

import { ObjectData } from '../../types/object-types';

import { settingsReducerSelectors } from './settings-reducer-selectors';
import { ObjectImportType } from '../../mstr-object/constants';

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

    if (object.importType === ObjectImportType.FORMATTED_DATA && copiedObject?.details) {
      copiedObject.details.excelTableSize = object?.formattedTableDimensions;
    }

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
