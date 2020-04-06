import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Popover } from 'antd';
import { reduxStore } from '../../store';
import { FileHistoryContainerNotConnected, FileHistoryContainer } from '../../file-history/file-history-container';
import { sessionHelper } from '../../storage/session-helper';
import { popupController } from '../../popup/popup-controller';
import * as LoadedFilesConstans from '../../file-history/office-loaded-file';
import officeStoreHelper from '../../office/store/office-store-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';


describe('FileHistoryContainer', () => {
  it('should render component when we are insinde project', () => {
    // given
    const mockReportArray = createMockFilesArray();
    const visualizationInfoMock = { dossierStructure: 'test', };
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <FileHistoryContainerNotConnected
        project="testProject"
        reportArray={mockReportArray}
        visualizationInfo={visualizationInfoMock}
      />
    </Provider>);
    // then
    expect(wrappedComponent.html()).not.toBeNull();
  });
  it('should display list of files when there are files', () => {
    // given
    const mockFiles = createMockFilesArray();
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <FileHistoryContainerNotConnected
        reportArray={mockFiles}
        project="testProject"
      />
    </Provider>);
    const wrappedListElements = wrappedComponent.find('div.file-history-container');
    // then
    expect(wrappedComponent.html()).not.toContain('No files loaded.');
    expect(wrappedListElements).toHaveLength(mockFiles.length);
  });
  it('should display refresh icon when refreshAll flag is false', () => {
    // given
    const refreshingAll = false;
    const mockReportArray = createMockFilesArray();
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <FileHistoryContainerNotConnected
        project="testProject"
        refreshingAll={refreshingAll}
        reportArray={mockReportArray}
      />
    </Provider>);
    // then
    expect(wrappedComponent.exists('.refresh-all-btn .mstr-icon-refresh-all MSTRIcon')).toBeTruthy();
  });
  it('should display refresh all spinner when refreshAll flag is true', () => {
    // given
    const refreshingAll = true;
    const mockReportArray = createMockFilesArray();
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <FileHistoryContainerNotConnected
        project="testProject"
        refreshingAll={refreshingAll}
        reportArray={mockReportArray}
      />
    </Provider>);
    // then
    expect(wrappedComponent.exists('.spinner-all-icon img')).toBeTruthy();
  });
  it('should run onRefreshAll when refreshAll is clicked', async () => {
    // given
    const refreshAllmock = jest.fn();
    const startLoadingMock = jest.fn();
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockReportArray = createMockFilesArray();
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <FileHistoryContainerNotConnected
        project="testProject"
        reportArray={mockReportArray}
        refreshReportsArray={refreshAllmock}
        startLoading={startLoadingMock}
      />
    </Provider>);
    const refreshButton = wrappedComponent.find('.refresh-all-btn');
    // when
    refreshButton.simulate('click');
    // then
    await expect(mockGetContext).toBeCalled();
    expect(refreshAllmock).toBeCalled();
  });

  it('should not run onRefreshAll when refreshAll is clicked', async () => {
    // given
    let setStateCallBack;
    const mockReportArray = createMockFilesArray();
    const startLoadingMock = jest.fn();
    const stopLoadingMock = jest.fn();
    LoadedFilesConstans.OfficeLoadedFile = () => <div />;
    const wrappedComponent = mount(<FileHistoryContainerNotConnected
      project="testProject"
      reportArray={mockReportArray}
      refreshReportsArray={jest.fn()}
      startLoading={startLoadingMock}
      stopLoading={stopLoadingMock}
    />);
    wrappedComponent.instance().ismounted = false;
    wrappedComponent.instance().setState = jest.fn((obj, callback) => { setStateCallBack = callback || (() => { }); });
    const refreshButton = wrappedComponent.find('.refresh-all-btn');
    // when
    refreshButton.simulate('click');
    await setStateCallBack();
    // then
    expect(wrappedComponent.instance().setState).toHaveBeenCalledTimes(1);
  });

  it('should open popup on button click', async () => {
    // given,
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    sessionHelperSpy.mockClear();
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected').mockImplementation(() => (false));
    const clickSpy = jest.spyOn(popupController, 'runPopupNavigation');
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <FileHistoryContainer
        project="testProject"
        reportArray={mockReportArray}
        refreshAll={refreshAllmock}
      />
    </Provider>);
    const wrappedButton = wrappedComponent.find('#add-data-btn-container').at(0);

    // when
    wrappedButton.simulate('click');
    // then
    expect(wrappedButton).toBeDefined();
    await expect(mockGetContext).toBeCalled();
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    await expect(clickSpy).toHaveBeenCalled();
  });

  it('should call componentWillUnmount ', () => {
    // given
    // when
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = mount(<FileHistoryContainerNotConnected
      project="testProject"
      refreshingAll={refreshAllmock}
      reportArray={mockReportArray}
      isSecured
      refreshReportsArray={mockRefreshReportArray}
      toggleSecuredFlag={mockToggleSecured}
    />);
    const tmp = wrappedComponent.instance();
    const mockRemoveListener = jest.spyOn(wrappedComponent.instance(), 'deleteRemoveReportListener').mockImplementation(jest.fn());
    wrappedComponent.instance().forceUpdate();
    wrappedComponent.unmount();
    // then
    expect(tmp).toBeTruthy();

    expect(tmp.ismounted).toBeFalsy();
    expect(mockRemoveListener).toBeCalled();
  });

  it('should contain popover', () => {
    // given
    const refreshingAll = true;
    const mockReportArray = createMockFilesArray();
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <FileHistoryContainerNotConnected
        project="testProject"
        refreshingAll={refreshingAll}
        reportArray={mockReportArray}
      />
    </Provider>);
    // then
    expect(wrappedComponent.find(Popover)).toHaveLength(1);
  });

  it('should NOT render lock screen if isSecured flag is set to false', () => {
    // given
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = mount(<FileHistoryContainerNotConnected
      project="testProject"
      refreshingAll={refreshAllmock}
      reportArray={mockReportArray}
      isSecured={false}
      refreshReportsArray={mockRefreshReportArray}
      toggleSecuredFlag={mockToggleSecured}
    />);
    // when
    const secureContainer = wrappedComponent.find('.secured-screen-container');
    // then
    expect(secureContainer).toHaveLength(0);
  });

  it('should render lock screen if isSecured flag is set to false', () => {
    // given
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = mount(<FileHistoryContainerNotConnected
      project="testProject"
      refreshingAll={refreshAllmock}
      reportArray={mockReportArray}
      isSecured
      refreshReportsArray={mockRefreshReportArray}
      toggleSecuredFlag={mockToggleSecured}
    />);
    // when
    const secureContainer = wrappedComponent.find('.secured-screen-container');
    // then
    expect(secureContainer).toHaveLength(1);
  });

  it('should call showData method when show data button is clicked', () => {
    // given
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = mount(<FileHistoryContainerNotConnected
      project="testProject"
      refreshingAll={refreshAllmock}
      reportArray={mockReportArray}
      isSecured
      refreshReportsArray={mockRefreshReportArray}
      toggleSecuredFlag={mockToggleSecured}
    />);
    const mockShowData = jest.spyOn(wrappedComponent.instance(), 'showData');
    wrappedComponent.instance().forceUpdate();
    const secureDataButton = wrappedComponent.find('Button .show-data-btn');
    // when
    secureDataButton.simulate('click');
    // then
    expect(mockShowData).toBeCalled();
  });
  it('should call proper functions in showData method', async () => {
    // given
    const refreshAllmock = jest.fn();
    const startLoadingMock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = shallow(<FileHistoryContainerNotConnected
      project="testProject"
      refreshingAll={refreshAllmock}
      reportArray={mockReportArray}
      isSecured
      refreshReportsArray={mockRefreshReportArray}
      toggleSecuredFlag={mockToggleSecured}
      startLoading={startLoadingMock}
    />);
    const mockRefreshAll = jest.spyOn(wrappedComponent.instance(), 'refreshAllAction');
    const checkStatusOfSessions = jest.spyOn(officeApiHelper, 'checkStatusOfSessions').mockImplementation(() => { });
    wrappedComponent.instance().forceUpdate();
    // when
    wrappedComponent.instance().showData();
    // then
    await expect(checkStatusOfSessions).toBeCalled();
    expect(mockRefreshAll).toBeCalled();
    expect(mockToggleSecured).toBeCalled();
  });
  it('should call toggle store secure flag in constructor if office flag is set to true', () => {
    // given
    const mockToggleStoreFlag = jest.spyOn(officeStoreHelper, 'isFileSecured').mockImplementation(() => true);
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    // when
    const wrappedComponent = mount(<FileHistoryContainerNotConnected
      project="testProject"
      refreshingAll={refreshAllmock}
      reportArray={mockReportArray}
      isSecured
      refreshReportsArray={mockRefreshReportArray}
      toggleSecuredFlag={mockToggleSecured}
    />);
    // then
    expect(mockToggleSecured).toBeCalledWith(true);
  });
});

const createMockFilesArray = () => {
  const mockArray = [];
  for (let i = 0; i < 6; i++) {
    mockArray.push({
      refreshDate: new Date(),
      id: `mockId_${i}`,
      name: `mockName_${i}`,
      bindId: `mockBindId_${i}`,
      objectType: { name: 'report' },
      visualizationInfo: {},
    });
  }
  return mockArray;
};
