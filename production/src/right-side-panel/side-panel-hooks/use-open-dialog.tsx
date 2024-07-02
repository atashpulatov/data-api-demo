import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DialogToOpen } from '../../redux-reducer/office-reducer/office-reducer-types';

import { dialogController } from '../../dialog/dialog-controller';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';
import { popupSelectors } from '../../redux-reducer/popup-reducer/popup-selectors';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';

/**
 * Hook that open dialog based on redux state
 */
export const useOpenDialog = (): void => {
  const dispatch = useDispatch();

  const dialogToOpen = useSelector(officeSelectors.selectDialogToOpen);
  const editedObject = useSelector(popupSelectors.selectEditedObject);
  const isEdit = useSelector(popupSelectors.selectIsEdit);
  const isDuplicate = useSelector(popupSelectors.selectIsDuplicate);

  const dialogParams = useMemo(
    () => ({
      object: editedObject,
      isEdit,
      isDuplicate,
    }),
    [editedObject, isEdit, isDuplicate]
  );

  useEffect(() => {
    if (dialogToOpen === DialogToOpen.POPUP_NAVIGATION) {
      dialogController.runPopupNavigation();
    } else if (dialogToOpen === DialogToOpen.IMPORTED_DATA_OVERVIEW_POPUP) {
      dialogController.runImportedDataOverviewPopup();
      // @ts-expect-error
      dispatch(popupStateActions.setIsDataOverviewOpen(true));
    } else if (dialogParams) {
      switch (dialogToOpen) {
        case DialogToOpen.EDIT_FILTERS_POPUP:
          dialogController.runEditFiltersPopup(dialogParams);
          break;
        case DialogToOpen.EDIT_DOSSIER_POPUP:
          dialogController.runEditDossierPopup(dialogParams);
          break;
        case DialogToOpen.REPROMPT_POPUP:
          dialogController.runRepromptPopup(dialogParams);
          break;
        case DialogToOpen.REPROMPT_DOSSIER_POPUP:
          dialogController.runRepromptDossierPopup(dialogParams);
          break;
        default:
          break;
      }
    }
    // @ts-expect-error
    dispatch(officeActions.setDialogToOpen(null));
  }, [dialogToOpen, dispatch, dialogParams]);
};
