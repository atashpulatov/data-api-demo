import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { PopupState } from './popup-reducer-types';

const getPopupState = (state: RootState): PopupState => state.popupReducer;

const selectEditedObject = createSelector(
  [getPopupState],
  (popupReducer: PopupState) => popupReducer.editedObject
);
const selectIsEdit = createSelector(
  [getPopupState],
  (popupReducer: PopupState) => popupReducer.isEdit
);
const selectIsDuplicate = createSelector(
  [getPopupState],
  (popupReducer: PopupState) => popupReducer.isDuplicate
);

export const popupSelectors = {
  selectEditedObject,
  selectIsEdit,
  selectIsDuplicate,
};
