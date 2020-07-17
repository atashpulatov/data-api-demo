import {
  RESET_STATE,
  SET_REPORT_N_FILTERS,
  SET_PREPARED_REPORT,
  SWITCH_IMPORT_SUBTOTALS_ON_EDIT } from '../../redux-reducer/popup-reducer/popup-actions';
import { initialState, popupReducer } from '../../redux-reducer/popup-reducer/popup-reducer';

describe('Popup Reducer', () => {
  it('should return proper state in case of RESET_STATE action', () => {
    // given
    const action = { type: RESET_STATE, };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({ ...initialState });
  });

  it('should return proper state in case of SET_REPORT_N_FILTERS action', () => {
    // given
    const editedObject = 'editedObject';
    const action = {
      type: SET_REPORT_N_FILTERS,
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
    const action = {
      type: SET_PREPARED_REPORT,
      instanceId,
      chosenObjectData,
    };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({ preparedInstance: instanceId, editedObject: chosenObjectData });
  });

  it('should return proper state in case of SWITCH_IMPORT_SUBTOTALS_ON_EDIT action, no initial subtotalsInfo', () => {
    // given
    const action = {
      type: SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
      data: { newSubtotalProperty: 'testNewSubtotalProperty', },
    };

    initialState.editedObject = {};

    // when
    const newState = popupReducer(initialState, action);

    // then
    expect(newState).toEqual({ ...initialState, editedObject: {} });
  });

  it('should return proper state in case of SWITCH_IMPORT_SUBTOTALS_ON_EDIT action', () => {
    // given
    const action = {
      type: SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
      data: { newSubtotalProperty: 'testNewSubtotalProperty', },
    };

    initialState.editedObject = { subtotalsInfo: { initialSubtotalProperty: 'testInitialSubtotalProperty' } };

    const resultState = {
      subtotalsInfo: {
        importSubtotal: { newSubtotalProperty: 'testNewSubtotalProperty' },
        initialSubtotalProperty: 'testInitialSubtotalProperty'
      }
    };

    // when
    const newState = popupReducer(initialState, action);

    // then
    expect(newState).toEqual({ ...initialState, editedObject: resultState });
  });

  it('should return undefined editedObject after SWITCH_IMPORT_SUBTOTALS_ON_EDIT action was called on undefined editedObject', () => {
    // given
    const action = {
      type: SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
      data: { newSubtotalProperty: 'testNewSubtotalProperty', },
    };

    initialState.editedObject = undefined;
    initialState.else = '123';

    // when
    const newState = popupReducer(initialState, action);

    // then
    expect(newState).toEqual({ ...initialState, editedObject: undefined });
  });
});
