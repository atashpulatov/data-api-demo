import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { PopupStateState, PopupTypeEnum } from './popup-state-reducer-types';

const getPopupState = (state: RootState): PopupStateState => state.popupStateReducer;

const selectPopupType = createSelector([getPopupState], popupState => popupState.popupType);

const selectIsDataOverviewOpen = createSelector(
  [getPopupState],
  (popupState: PopupStateState) => popupState.isDataOverviewOpen
);

const selectImportType = createSelector(
  [getPopupState],
  (popupState: PopupStateState) => popupState.importType
);

const selectIsPromptDialog = createSelector(
  [getPopupState],
  (popupState: PopupStateState) =>
    popupState.popupType === PopupTypeEnum.promptsWindow ||
    popupState.popupType === PopupTypeEnum.repromptingWindow ||
    popupState.popupType === PopupTypeEnum.repromptReportDataOverview
);

const selectIsObjectPrompted = createSelector(
  [getPopupState],
  // TODO fix reducer structure
  (popupState: PopupStateState) => popupState.isPrompted?.isPrompted
);

export const popupStateSelectors = {
  selectPopupType,
  selectIsDataOverviewOpen,
  selectImportType,
  selectIsPromptDialog,
  selectIsObjectPrompted,
};
