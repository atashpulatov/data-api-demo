import { createStore } from 'redux';
import { officeReducer } from '../../redux-reducer/office-reducer/office-reducer';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import { OfficeError } from '../../office/office-error';

describe('officeReducer', () => {
  const officeStore = createStore(officeReducer);

  const reportArrayMock = [
    {
      id: 'firstTestId',
      name: 'firstTestName',
      bindId: 'firstBindId',
      projectId: 'firstProjectId',
      envUrl: 'firstEnvUrl',
    },
    {
      id: 'secondTestId',
      name: 'secondTestName',
      bindId: 'secondBindId',
      projectId: 'secondProjectId',
      envUrl: 'secondEnvUrl',
    },
    {
      id: 'thirdTestId',
      name: 'thirdTestName',
      bindId: 'thirdBindId',
      projectId: 'thirdProjectId',
      envUrl: 'thirdEnvUrl',
    },
  ];

  beforeEach(() => {
    // default state should be empty
    expect(officeStore.getState()).toEqual({
      loading: false, shouldRenderSettings: false, isSettings: false, isConfirm: false, supportForms: true
    });
  });

  afterEach(() => {
    officeStore.dispatch({ type: officeProperties.actions.removeAllReports, });
  });


  it('should remove reports stored', () => {
    // given
    const firstReport = reportArrayMock[0];
    const secondReport = reportArrayMock[1];
    // when
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: firstReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: secondReport,
    });
    officeStore.dispatch({ type: officeProperties.actions.removeAllReports, });
    // then
    const officeStoreState = officeStore.getState();
    const storedReport = officeStoreState.reportArray;
    expect(storedReport).toBeUndefined();
  });

  it('should save next report data to store as the first element in the array', () => {
    // given
    const firstReport = reportArrayMock[0];
    const secondReport = reportArrayMock[1];
    // when
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: firstReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: secondReport,
    });
    // then
    const officeStoreState = officeStore.getState();
    const storedReport = officeStoreState.reportArray[0];
    expect(storedReport).toBeDefined();
    expect(storedReport).toBe(secondReport);
  });

  it('should remove report with given bindId', () => {
    // given
    const firstReport = reportArrayMock[0];
    const secondReport = reportArrayMock[1];
    const thirdReport = reportArrayMock[2];
    // when
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: firstReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: secondReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: thirdReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.removeReport,
      reportBindId: secondReport.bindId,
    });
    // then
    const officeStoreState = officeStore.getState().reportArray;
    expect(officeStoreState).toHaveLength(2);
    expect(officeStoreState.includes(firstReport)).toBe(true);
    expect(officeStoreState.includes(secondReport)).toBe(false);
    expect(officeStoreState.includes(thirdReport)).toBe(true);
  });

  it('should throw an error on missing report.bindId when removing report', () => {
    // given
    // when
    const wrongDispatch = () => {
      officeStore.dispatch({ type: officeProperties.actions.removeReport, });
    };
    // then
    expect(wrongDispatch).toThrowError(OfficeError);
    expect(wrongDispatch).toThrowError('Missing reportBindId');
  });

  it('should overwrite reports array with given one', () => {
    // given
    const firstReport = reportArrayMock[0];
    const secondReport = reportArrayMock[1];
    const thirdReport = reportArrayMock[2];
    const reportArrayNew = [
      {
        id: 'NEWfirstTestId',
        name: 'NEWfirstTestName',
        bindId: 'NEWfirstBindId',
        envUrl: 'NEWfirstEnvUrl',
        projectId: 'NEWfirstProjectId',
      },
      {
        id: 'NEWsecondTestId',
        name: 'NEWsecondTestName',
        bindId: 'NEWsecondBindId',
        envUrl: 'NEWsecondEnvUrl',
        projectId: 'NEWsecondProjectId',
      },
    ];
    // when
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: firstReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: secondReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.loadReport,
      report: thirdReport,
    });
    officeStore.dispatch({
      type: officeProperties.actions.loadAllReports,
      reportArray: reportArrayNew,
    });
    // then
    const officeStoreState = officeStore.getState().reportArray;
    expect(officeStoreState).toHaveLength(2);
    expect(officeStoreState[0]).toEqual(reportArrayNew[0]);
    expect(officeStoreState[1]).toEqual(reportArrayNew[1]);
  });
  it('should throw an error on missing reportArray', () => {
    // given
    // when
    const wrongDispatch = () => {
      officeStore.dispatch({ type: officeProperties.actions.loadAllReports, });
    };
    // then
    expect(wrongDispatch).toThrowError(OfficeError);
    expect(wrongDispatch).toThrowError('Missing reportArray');
  });
  it('should throw an error on missing property in one of items in reportArray', () => {
    // given
    const originalId = reportArrayMock[1];
    reportArrayMock[1].id = undefined;
    // when
    const wrongDispatch = () => {
      officeStore.dispatch({
        type: officeProperties.actions.loadAllReports,
        reportArray: reportArrayMock,
      });
    };
    // then
    expect(wrongDispatch).toThrowError(OfficeError);
    expect(wrongDispatch).toThrowError('Missing report.id');
    reportArrayMock[1].id = originalId;
  });
  it('should set popupOpen to true onPopupShown', () => {
    // given
    const prevState = { popupOpen: false };
    const action = { type: officeProperties.actions.popupShown };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.popupOpen).toBe(true);
  });
  it('should set popupOpen to false onPopupHidden', () => {
    // given
    const prevState = { popupOpen: true };
    const action = { type: officeProperties.actions.popupHidden };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.popupOpen).toBe(false);
  });
  it('should dispatch proper action when startLoading', () => {
    // given
    const prevState = { loading: false };
    const action = { type: officeProperties.actions.startLoading };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.loading).toBe(true);
  });
  it('should dispatch proper action when onStartLoadingReport', () => {
    // given
    const prevState = { reportArray: [...reportArrayMock], loading: false };
    const action = { type: officeProperties.actions.startLoadingReport, reportBindId: 'secondBindId' };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.loading).toBe(true);
    expect(newState.reportArray[1].isLoading).toBe(true);
  });
  it('should throw when onStartLoadingReport for empty reportBindId', () => {
    // given
    const prevState = { reportArray: [...reportArrayMock], loading: false };
    const action = { type: officeProperties.actions.startLoadingReport };
    // when
    const newState = () => {
      officeReducer(prevState, action);
    };
    // then
    expect(newState).toThrowError('Missing reportBindId');
  });
  it('should dispatch proper action when onFinishLoadingReport', () => {
    // given
    const prevState = { reportArray: [...reportArrayMock], loading: true };
    const action = { type: officeProperties.actions.finishLoadingReport, reportBindId: 'secondBindId' };
    // when
    const newState = officeReducer(prevState, action);
    // then
    expect(newState.loading).toBe(false);
    expect(newState.reportArray[1].isLoading).toBe(false);
  });
  it('should throw when onFinishLoadingReport for empty reportBindId', () => {
    // given
    const prevState = { reportArray: [...reportArrayMock], loading: true };
    const action = { type: officeProperties.actions.startLoadingReport };
    // when
    const newState = () => {
      officeReducer(prevState, action);
    };
    // then
    expect(newState).toThrowError('Missing reportBindId');
  });
  it('should return new proper state in case of toggleSecuredFlag action', () => {
    // given
    const oldState = { isSecured: false };
    const action = {
      type: officeProperties.actions.toggleSecuredFlag,
      isSecured: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSecured: true });
  });
  it('should return new proper state in case of toggleIsSettingsFlag action', () => {
    // given
    const oldState = { isSettings: false };
    const action = {
      type: officeProperties.actions.toggleIsSettingsFlag,
      isSettings: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSettings: true });
  });
  it('should return new proper state in case of toggleIsConfirmFlag action', () => {
    // given
    const oldState = { isConfirm: false, isSettings: false };
    const action = {
      type: officeProperties.actions.toggleIsConfirmFlag,
      isConfirm: true,
      isSettings: false,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isConfirm: true, isSettings: false });
  });
  it('should return new proper state in case of toggleRenderSettingsFlag action', () => {
    // given
    const oldState = { isSettings: false, shouldRenderSettings: false };
    const action = {
      type: officeProperties.actions.toggleRenderSettingsFlag,
      isSettings: false,
      shouldRenderSettings: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState).toEqual({ isSettings: false, shouldRenderSettings: true });
  });
  it('should set preLoadReport to given value on preLoadReport', () => {
    // given
    const oldState = { preLoadReport: false };
    const action = {
      type: officeProperties.actions.preLoadReport,
      preLoadReport: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.preLoadReport).toBe(true);
  });
  it('should set IsClearDataFailed to given value on toggleIsClearDataFailedFlag', () => {
    // given
    const oldState = { IsClearDataFailed: false };
    const action = {
      type: officeProperties.actions.toggleIsClearDataFailedFlag,
      IsClearDataFailed: true,
    };
    // when
    const newState = officeReducer(oldState, action);
    // then
    expect(newState.IsClearDataFailed).toBe(true);
  });
});
