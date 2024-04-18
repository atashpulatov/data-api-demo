import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { OfficeState } from './office-reducer-types';

const getOfficeState = (state: RootState): OfficeState => state.officeReducer;

const selectIsPivotTableSupported = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isPivotTableSupported
);

const selectIsShapeAPISupported = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isShapeAPISupported
);

const selectIsInsertWorksheetAPISupported = createSelector(
  [getOfficeState],
  (officeReducer: OfficeState) => officeReducer.isInsertWorksheetAPISupported
);

export const officeSelectors = {
  selectIsPivotTableSupported,
  selectIsShapeAPISupported,
  selectIsInsertWorksheetAPISupported
};
