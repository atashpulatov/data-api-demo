import { createSelector } from 'reselect';

const getOfficeState = (state: any): any => state.officeReducer;

export const selectIsImportAsPivotTableSupported = createSelector(
  [getOfficeState],
  officeState => officeState.isImportAsPivotTableSupported
);
