import { useSelector } from 'react-redux';

import { ImportButtonOptionsType } from './import-button-types';

import mstrObjectType from '../../../mstr-object/mstr-object-type-enum';
import { navigationTreeSelectors } from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-selectors';
import { officeSelectors } from '../../../redux-reducer/office-reducer/office-reducer-selectors';
import { popupSelectors } from '../../../redux-reducer/popup-reducer/popup-selectors';
import { ObjectImportType } from '../../../mstr-object/constants';
import { optionsDictionary } from './import-button-constants';

/**
 * Gets the import button options array.
 * If import as visualization is allowed, then it's added to the options array.
 * If import as pivot table is allowed, then it's added to the options array.
 * If it's edit mode disable other options from previously selected.
 * @returns options array for the import button
 */
const useGetImportOptions = (): ImportButtonOptionsType[] => {
  const isPivotTableSupported = useSelector(officeSelectors.selectIsPivotTableSupported);
  const isShapeAPISupported = useSelector(officeSelectors.selectIsShapeAPISupported);
  const isInsertWorksheetAPISupported = useSelector(officeSelectors.selectIsInsertWorksheetAPISupported);
  const selectedMstrObjectType = useSelector(navigationTreeSelectors.selectMstrObjectType);
  const isEdit = useSelector(navigationTreeSelectors.selectIsEdit);
  const editedObject = useSelector(popupSelectors.selectEditedObject);

  const options: ImportButtonOptionsType[] = [];

  if (isEdit) {
    options.push(optionsDictionary[editedObject.importType]);
    return options;
  }

  options.push(optionsDictionary[ObjectImportType.TABLE]);

  if (isInsertWorksheetAPISupported) {
    options.push(optionsDictionary[ObjectImportType.FORMATTED_DATA]);
  }

  if (isShapeAPISupported && selectedMstrObjectType === mstrObjectType.mstrObjectType.dossier) {
    options.push(optionsDictionary[ObjectImportType.IMAGE]);
  }

  if (isPivotTableSupported) {
    options.push(optionsDictionary[ObjectImportType.PIVOT_TABLE]);
  }

  return options;
};

export default useGetImportOptions;
