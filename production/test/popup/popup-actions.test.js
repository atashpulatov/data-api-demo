import * as actions from '../../src/popup/popup-actions';
import {officeDisplayService} from '../../src/office/office-display-service';

describe('Popup actions', () => {
  it('should dispatch proper refreshAll action', async () => {
    // given
    const listener = jest.fn();
    const refreshAllMock = jest.spyOn(officeDisplayService, 'refreshAll').mockImplementation(() => { });
    const reportArray = {
      report1: {

      },
      report2: {

      },
    };
    // when
    await actions.refreshAll(reportArray)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({type: actions.START_REFRESHING_ALL_REPORTS});
    expect(refreshAllMock).toBeCalledWith(reportArray);
    expect(listener).toHaveBeenCalledWith({type: actions.STOP_REFRESHING_ALL_REPORTS});
  });

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
