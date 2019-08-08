import {mount, shallow} from 'enzyme';
import React from 'react';
import {Provider} from 'react-redux';
import {reduxStore} from '../../src/store';
import {_FileHistoryContainer, FileHistoryContainer} from '../../src/file-history/file-history-container';
import {sessionHelper} from '../../src/storage/session-helper';
import {popupController} from '../../src/popup/popup-controller';
import * as LoadedFilesConstans from '../../src/file-history/office-loaded-file.jsx';
import {Popover} from 'antd';
import {officeStoreService} from '../../src/office/store/office-store-service';
import {authenticationHelper} from '../../src/authentication/authentication-helper';
import {officeApiHelper} from '../../src/office/office-api-helper';

describe('FileHistoryContainer', () => {
  it('should render component when we are insinde project', () => {
    // given
    const mockReportArray = createMockFilesArray();
    // when
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          <_FileHistoryContainer
            project={'testProject'}
            reportArray={mockReportArray} />
        </Provider>
    );
    // then
    expect(wrappedComponent.html()).not.toBeNull();
  });
  it('should display list of files when there are files', () => {
    // given
    const mockFiles = createMockFilesArray();
    // when
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          <_FileHistoryContainer
            reportArray={mockFiles}
            project={'testProject'} />
        </Provider>
    );
    const wrappedListElements = wrappedComponent.find('Row');
    // then
    expect(wrappedComponent.html()).not.toContain('No files loaded.');
    expect(wrappedListElements.length).toEqual(mockFiles.length);
  });
  it('should display refresh icon when refreshAll flag is false', () => {
    // given
    const refreshingAll = false;
    const mockReportArray = createMockFilesArray();
    // when
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          < _FileHistoryContainer
            project={'testProject'}
            refreshingAll={refreshingAll}
            reportArray={mockReportArray} />
        </Provider>);
    // then
    expect(wrappedComponent.exists('Button .refresh-all-btn MSTRIcon')).toBeTruthy();
  });
  it('should display refresh all spinner when refreshAll flag is true', () => {
    // given
    const refreshingAll = true;
    const mockReportArray = createMockFilesArray();
    // when
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          < _FileHistoryContainer
            project={'testProject'}
            refreshingAll={refreshingAll}
            reportArray={mockReportArray} />
        </Provider>);
    // then
    expect(wrappedComponent.exists('Button .refresh-all-btn img')).toBeTruthy();
  });
  it('should run onRefreshAll when refreshAll is clicked', () => {
    // given
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          < _FileHistoryContainer
            project={'testProject'}
            reportArray={mockReportArray}
            refreshReportsArray={refreshAllmock} />
        </Provider>);
    const refreshButton = wrappedComponent.find('Button .refresh-all-btn');
    // when
    refreshButton.simulate('click');
    // then
    expect(refreshAllmock).toBeCalled();
  });
  it('should not run onRefreshAll when refreshAll is clicked', async () => {
    // given
    let setStateCallBack;
    const mockReportArray = createMockFilesArray();
    LoadedFilesConstans.OfficeLoadedFile = () => <div></div>;
    const wrappedComponent = mount(
        <_FileHistoryContainer
          project={'testProject'}
          reportArray={mockReportArray}
          refreshReportsArray={jest.fn()} />);
    wrappedComponent.instance()._ismounted = false;
    wrappedComponent.instance().setState = jest.fn((obj, callback) => setStateCallBack = callback || (() => {}));
    const refreshButton = wrappedComponent.find('Button .refresh-all-btn');
    // when
    refreshButton.simulate('click');
    await setStateCallBack();
    // then
    expect(wrappedComponent.instance().setState).toHaveBeenCalledTimes(1);
  });

  it('should open popup on button click', () => {
    // given
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    sessionHelperSpy.mockClear();
    const clickSpy = jest.spyOn(popupController, 'runPopupNavigation');
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          < FileHistoryContainer
            project={'testProject'}
            reportArray={mockReportArray}
            refreshAll={refreshAllmock} />
        </Provider>);
    const wrappedButton = wrappedComponent.find('#add-data-btn-container').at(0);

    // when
    wrappedButton.simulate('click');
    // then
    expect(wrappedButton).toBeDefined();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should call componentWillUnmount ', () => {
    // given
    // when
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = mount(
        < _FileHistoryContainer
          project={'testProject'}
          refreshingAll={refreshAllmock}
          reportArray={mockReportArray}
          isSecured={true}
          refreshReportsArray={mockRefreshReportArray}
          toggleSecuredFlag={mockToggleSecured}
        />);
    const tmp = wrappedComponent.instance();
    const mockRemoveListener = jest.spyOn(wrappedComponent.instance(), 'deleteRemoveReportListener').mockImplementation(jest.fn());
    wrappedComponent.instance().forceUpdate();
    wrappedComponent.unmount();
    // then
    expect(tmp).toBeTruthy();

    expect(tmp._ismounted).toBeFalsy();
    expect(mockRemoveListener).toBeCalled();
  });

  it('should contain popover', () => {
    // given
    const refreshingAll = true;
    const mockReportArray = createMockFilesArray();
    // when
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          < _FileHistoryContainer
            project={'testProject'}
            refreshingAll={refreshingAll}
            reportArray={mockReportArray} />
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
    const wrappedComponent = mount(
        < _FileHistoryContainer
          project={'testProject'}
          refreshingAll={refreshAllmock}
          reportArray={mockReportArray}
          isSecured={false}
          refreshReportsArray={mockRefreshReportArray}
          toggleSecuredFlag={mockToggleSecured}
        />);
    // when
    const secureContainer = wrappedComponent.find('.secured-screen-container');
    // then
    expect(secureContainer.length).toBe(0);
  });

  it('should render lock screen if isSecured flag is set to false', () => {
    // given
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = mount(
        < _FileHistoryContainer
          project={'testProject'}
          refreshingAll={refreshAllmock}
          reportArray={mockReportArray}
          isSecured={true}
          refreshReportsArray={mockRefreshReportArray}
          toggleSecuredFlag={mockToggleSecured}
        />);
    // when
    const secureContainer = wrappedComponent.find('.secured-screen-container');
    // then
    expect(secureContainer.length).toBe(1);
  });

  it('should call showData method when show data button is clicked', () => {
    // given
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = mount(
        < _FileHistoryContainer
          project={'testProject'}
          refreshingAll={refreshAllmock}
          reportArray={mockReportArray}
          isSecured={true}
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
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    const wrappedComponent = shallow(
        < _FileHistoryContainer
          project={'testProject'}
          refreshingAll={refreshAllmock}
          reportArray={mockReportArray}
          isSecured={true}
          refreshReportsArray={mockRefreshReportArray}
          toggleSecuredFlag={mockToggleSecured}
        />);
    const mockRefreshAll = jest.spyOn(wrappedComponent.instance(), 'refreshAllAction');
    const mockValidateToken = jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(() => {});
    const mockGetExcelSession = jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementation(() => {});
    wrappedComponent.instance().forceUpdate();
    // when
    wrappedComponent.instance().showData();
    // then
    await Promise.all([expect(mockValidateToken).toBeCalled(), expect(mockGetExcelSession).toBeCalled()]);
    expect(mockRefreshAll).toBeCalled();
    expect(mockToggleSecured).toBeCalled();
  });
  it('should call toggle store secure flag in constructor if office flag is set to true', () => {
    // given
    const mockToggleStoreFlag = jest.spyOn(officeStoreService, 'isFileSecured').mockImplementation(() => true);
    const refreshAllmock = jest.fn();
    const mockReportArray = createMockFilesArray();
    const mockRefreshReportArray = jest.fn();
    const mockToggleSecured = jest.fn();
    // when
    const wrappedComponent = mount(
        < _FileHistoryContainer
          project={'testProject'}
          refreshingAll={refreshAllmock}
          reportArray={mockReportArray}
          isSecured={true}
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
      id: 'mockId_' + i,
      name: 'mockName_' + i,
      bindId: 'mockBindId_' + i,
    });
  }
  return mockArray;
};
