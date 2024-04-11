import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { PopupState } from './popup-reducer-types';

const getPopupState = (state: RootState): PopupState => state.popupReducer;

const selectEditedObject = createSelector(
  [getPopupState],
  (popupReducer: PopupState) => popupReducer.editedObject
);

export const popupSelectors = {
  selectEditedObject,
};
