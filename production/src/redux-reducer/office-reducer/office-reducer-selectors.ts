import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { OfficeState } from './office-reducer-types';

const getOfficeState = (state: RootState): OfficeState => state.officeReducer;

const selectIsPivotTableSupported = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isPivotTableSupported
);

const selectIsSecured = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isSecured
);

const selectIsClearDataFailed = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isClearDataFailed
);

const selectActiveCellAddress = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.activeCellAddress
);

const selectPopupData = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.popupData
);

const selectIsShapeAPISupported = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isShapeAPISupported
);

const selectIsInsertWorksheetAPISupported = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isInsertWorksheetAPISupported
);

const selectReusePromptAnswers = createSelector(
  [getOfficeState],
  officeState => officeState.reusePromptAnswers
);

const selectIsDialogLoaded = createSelector(
  [getOfficeState],
  officeState => officeState.isDialogLoaded
);

const selectIsDialogOpen = createSelector(
  [getOfficeState],
  officeState => officeState.isDialogOpen
);

const selectIsSettingsPanelLoaded = createSelector(
  [getOfficeState],
  officeState => officeState.settingsPanelLoaded
);

export const officeSelectors = {
  selectIsPivotTableSupported,
  selectIsShapeAPISupported,
  selectIsInsertWorksheetAPISupported
  selectReusePromptAnswers,
  selectIsSecured,
  selectActiveCellAddress,
  selectPopupData,
  selectIsClearDataFailed,
  selectIsDialogLoaded,
  selectIsDialogOpen,
  selectIsSettingsPanelLoaded,
};
