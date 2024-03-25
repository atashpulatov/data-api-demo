import {
  EditedObject,
  PopupActionTypes,
  ResetStateAction,
  SetPreparedReportAction,
  SetReportNFiltersAction,
  SwitchImportSubtotalsOnEditAction,
} from './popup-reducer-types';

import { initialState, popupReducer } from './popup-reducer';

describe('Popup Reducer', () => {
  it('should return proper state in case of RESET_STATE action', () => {
    // given
    const action: ResetStateAction = { type: PopupActionTypes.RESET_STATE };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({ ...initialState });
  });

  it('should return proper state in case of SET_REPORT_N_FILTERS action', () => {
    // given
    const editedObject = 'editedObject';
    const action: SetReportNFiltersAction = {
      type: PopupActionTypes.SET_REPORT_N_FILTERS,
      editedObject,
    };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({ editedObject });
  });

  it('should return proper state in case of SET_PREPARED_REPORT action', () => {
    // given
    const instanceId = 'id';
    const chosenObjectData = { newData: 'data' };
    const action: SetPreparedReportAction = {
      type: PopupActionTypes.SET_PREPARED_REPORT,
      instanceId,
      chosenObjectData,
    };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({
      preparedInstance: instanceId,
      editedObject: chosenObjectData,
    });
  });

  it('should return proper state in case of SWITCH_IMPORT_SUBTOTALS_ON_EDIT action, no initial subtotalsInfo', () => {
    // given
    const action: SwitchImportSubtotalsOnEditAction = {
      type: PopupActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
      data: { newSubtotalProperty: 'testNewSubtotalProperty' },
    };

    initialState.editedObject = {} as EditedObject;

    // when
    const newState = popupReducer(initialState, action);

    // then
    expect(newState).toEqual({ ...initialState, editedObject: {} });
  });

  it('should return proper state in case of SWITCH_IMPORT_SUBTOTALS_ON_EDIT action', () => {
    // given
    const action: SwitchImportSubtotalsOnEditAction = {
      type: PopupActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
      data: { newSubtotalProperty: 'testNewSubtotalProperty' },
    };

    initialState.editedObject = {
      subtotalsInfo: { initialSubtotalProperty: 'testInitialSubtotalProperty' },
    } as unknown as EditedObject;

    const resultState = {
      subtotalsInfo: {
        importSubtotal: { newSubtotalProperty: 'testNewSubtotalProperty' },
        initialSubtotalProperty: 'testInitialSubtotalProperty',
      },
    };

    // when
    const newState = popupReducer(initialState, action);

    // then
    expect(newState).toEqual({ ...initialState, editedObject: resultState });
  });

  it('should return undefined editedObject after SWITCH_IMPORT_SUBTOTALS_ON_EDIT action was called on undefined editedObject', () => {
    // given
    const action: SwitchImportSubtotalsOnEditAction = {
      type: PopupActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
      data: { newSubtotalProperty: 'testNewSubtotalProperty' },
    };

    initialState.editedObject = undefined;
    initialState.preparedInstance = 'preparedInstance';

    // when
    const newState = popupReducer(initialState, action);

    // then
    expect(newState).toEqual({ ...initialState, editedObject: undefined });
  });
});
