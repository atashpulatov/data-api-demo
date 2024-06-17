import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';

export const useResetDialog = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    officeActions.hideDialog()(dispatch);
    officeActions.toggleIsSettingsFlag(false)(dispatch);
    popupStateActions.onClearPopupState()(dispatch);
    officeActions.setPopupData(null);
  }, [dispatch]);
};
