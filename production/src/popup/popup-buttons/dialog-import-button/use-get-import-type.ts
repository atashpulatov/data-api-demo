import { useDispatch, useSelector } from 'react-redux';

import { ImportButtonOptionsType } from './import-button-types';

import { navigationTreeSelectors } from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-selectors';
import { popupStateActions } from '../../../redux-reducer/popup-state-reducer/popup-state-actions';
import { popupStateSelectors } from '../../../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';
import { settingsReducerSelectors } from '../../../redux-reducer/settings-reducer/settings-reducer-selectors';
import { ObjectImportType } from '../../../mstr-object/constants';

const useGetImportType = (options: ImportButtonOptionsType[]): ObjectImportType => {
  const defaultImportType = useSelector(settingsReducerSelectors.selectImportType);
  const selectedImportType = useSelector(popupStateSelectors.selectImportType);
  const isEdit = useSelector(navigationTreeSelectors.selectIsEdit);
  const dispatch = useDispatch();

  if (!options.length) {
    return undefined;
  }

  // Despite the formatted data import type is being supported by default for report/dossiers, the supported 
  // import options set is missing the formatted data import type, due to the object is not being selected yet.
  const isDefaultImportTypeFormattedData = defaultImportType === ObjectImportType.FORMATTED_DATA;

  const isDefaultImportTypeSupportedByObject = options.some(({ key }) => key === defaultImportType)
    || isDefaultImportTypeFormattedData;

  const fallbackImportType = isDefaultImportTypeSupportedByObject
    ? defaultImportType
    : ObjectImportType.TABLE;

  const importType = selectedImportType || fallbackImportType;

  if (!selectedImportType && isEdit) {
    dispatch(popupStateActions.setImportType(importType) as any);
  }

  return importType;
};

export default useGetImportType;
