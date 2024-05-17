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

  const isDefaultImportTypeSupportedByObject = options.some(({ key }) => key === defaultImportType);
  const importType = !options.length
    ? undefined
    : selectedImportType ||
      (isDefaultImportTypeSupportedByObject ? defaultImportType : ObjectImportType.TABLE);

  if (!selectedImportType && isEdit) {
    dispatch(popupStateActions.setImportType(importType) as any);
  }

  return importType;
};

export default useGetImportType;
