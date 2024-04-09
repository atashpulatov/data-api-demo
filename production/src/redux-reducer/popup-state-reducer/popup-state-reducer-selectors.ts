import { createSelector } from 'reselect';

const getPopupState = (state: any): any => state.popupStateReducer;

export const selectPopupType = createSelector([getPopupState], popupState => popupState.popupType);

export const selectIsDataOverviewOpen = createSelector(
  [getPopupState],
  popupState => popupState.isDataOverviewOpen
);

export const selectImportType = createSelector(
  [getPopupState],
  popupState => popupState.importType
);
