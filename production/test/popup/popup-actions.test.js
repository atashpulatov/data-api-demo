import * as actions from '../../src/popup/popup-actions';
import {authenticationHelper} from '../../src/authentication/authentication-helper';

describe('Popup actions', () => {
  it('should dispatch proper startReportLoading action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.startReportLoading('testReport')(listener);
    // then
    expect(listener).toHaveBeenCalledWith({refreshingReport: 'testReport', type: actions.START_REPORT_LOADING});
  });

  it('should dispatch proper stopReportLoading action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.stopReportLoading(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({type: actions.STOP_REPORT_LOADING});
  });

  it('should dispatch proper resetState action', () => {
    // given
    const listener = jest.fn();
    // when
    actions.resetState(true)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({type: actions.RESET_STATE});
  });
})
;
