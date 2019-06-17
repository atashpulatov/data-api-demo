import {
  START_REPORT_LOADING,
  STOP_REPORT_LOADING,
  RESET_STATE,
  SET_REPORT_N_FILTERS,
} from '../../src/popup/popup-actions';

import {initialState, popupReducer} from '../../src/popup/popup-reducer';

describe('Popup Reducer', () => {
  it('should return proper state in case of START_REPORT_LOADING action', () => {
    // given
    const action = {
      type: START_REPORT_LOADING,
      data: {
        name: 'testReport',
      },
    };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({...initialState, refreshingReport: 'testReport'});
  });

  it('should return proper state in case of STOP_REPORT_LOADING action', () => {
    // given
    const action = {
      type: STOP_REPORT_LOADING,
    };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({...initialState, refreshingReport: undefined});
  });

  it('should return proper state in case of RESET_STATE action', () => {
    // given
    const action = {
      type: RESET_STATE,
    };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({...initialState});
  });

  it('should return proper state in case of SET_REPORT_N_FILTERS action', () => {
    // given
    const editedReport = 'editedReport';
    const action = {
      type: SET_REPORT_N_FILTERS,
      editedReport,
    };
    // when
    const newState = popupReducer(initialState, action);
    // then
    expect(newState).toEqual({editedReport});
  });
});
