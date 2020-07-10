import {
  RESET_STATE,
  SET_REPORT_N_FILTERS,
  SET_PREPARED_REPORT,
} from '../../redux-reducer/popup-reducer/popup-actions';

import { initialState, popupReducer } from '../../redux-reducer/popup-reducer/popup-reducer';
import { SWITCH_IMPORT_SUBTOTALS } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';

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

  it('should return proper state in case of SWITCH_IMPORT_SUBTOTALS action, no initial subtotalsInfo', () => {
    // given
    const action = {
      type: SWITCH_IMPORT_SUBTOTALS,
      data: { newSubtotalProperty: 'testNewSubtotalProperty', },
    };

    initialState.editedObject = {};

    // when
    const newState = popupReducer(initialState, action);

    // then
    expect(newState).toEqual({ ...initialState, editedObject: {} });
  });

  it('should return proper state in case of SWITCH_IMPORT_SUBTOTALS action', () => {
    // given
    const action = {
      type: SWITCH_IMPORT_SUBTOTALS,
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

  it('should return undefined editedObject after SWITCH_IMPORT_SUBTOTALS action was called on undefined editedObject', () => {
    // given
    const action = {
      type: SWITCH_IMPORT_SUBTOTALS,
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
