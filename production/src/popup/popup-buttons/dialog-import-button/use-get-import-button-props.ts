import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import dialogButtonHelper from '../dialog-button-helper';

import { ImportButtonOptionsType } from './import-button-types';

import mstrObjectType from '../../../mstr-object/mstr-object-type-enum';
import { navigationTreeSelectors } from '../../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-selectors';
import { popupStateSelectors } from '../../../redux-reducer/popup-state-reducer/popup-state-reducer-selectors';
import { ObjectImportType } from '../../../mstr-object/constants';

/**
 * Gets the import button props depending on the view and workflow
 * @param importType - the object import type
 * @returns shouldDisplayOptions - boolean indicating if the options should be displayed
 * @returns importButtonProps - the id and actionType for the import button
 */
const useGetImportButtonProps = (
  importType: ObjectImportType,
  options: ImportButtonOptionsType[]
): {
  shouldDisplayOptions: boolean;
  importButtonProps: { id: string; actionType: string };
} => {
  const isObjectSelected = useSelector(navigationTreeSelectors.selectIsObjectSelected);
  const selectedMstrObjectType = useSelector(navigationTreeSelectors.selectMstrObjectType);
  const isDossierOpenRequested = useSelector(navigationTreeSelectors.selectIsDossierOpenRequested);
  const isPromptDialog = useSelector(popupStateSelectors.selectIsPromptDialog);

  const shouldDisplayOptions = useMemo(
    () =>
      options.length > 1 &&
      isObjectSelected &&
      !isPromptDialog &&
      (selectedMstrObjectType !== mstrObjectType.mstrObjectType.dossier || isDossierOpenRequested),
    [
      options.length,
      isObjectSelected,
      isPromptDialog,
      selectedMstrObjectType,
      isDossierOpenRequested,
    ]
  );

  const importButtonProps = dialogButtonHelper.getImportButtonProps(isPromptDialog, importType);

  return { shouldDisplayOptions, importButtonProps };
};

export default useGetImportButtonProps;
