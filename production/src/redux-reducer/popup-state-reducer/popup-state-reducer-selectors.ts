import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { DialogType, PopupStateState } from './popup-state-reducer-types';

const getPopupState = (state: RootState): PopupStateState => state.popupStateReducer;

const selectPopupType = createSelector([getPopupState], popupState => popupState.popupType);

const selectDialogType = createSelector([getPopupState], popupState => popupState.dialogType);

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
    popupState.dialogType === DialogType.promptsWindow ||
    popupState.dialogType === DialogType.repromptingWindow ||
    popupState.dialogType === DialogType.repromptDossierDataOverview ||
    popupState.dialogType === DialogType.repromptReportDataOverview ||
    popupState.dialogType === DialogType.multipleRepromptTransitionPage
);

const selectPrefilteredSourceObjectName = createSelector(
  [getPopupState],
  (popupState: PopupStateState) => popupState.prefilteredSourceObjectName
);

export const popupStateSelectors = {
  selectPopupType,
  selectIsDataOverviewOpen,
  selectImportType,
  selectIsPromptDialog,
  selectDialogType,
  selectPrefilteredSourceObjectName,
};
