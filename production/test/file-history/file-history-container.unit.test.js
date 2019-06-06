import {mount} from 'enzyme';
import React from 'react';
import {Provider} from 'react-redux';
import {reduxStore} from '../../src/store';
import {_FileHistoryContainer, FileHistoryContainer} from '../../src/file-history/file-history-container';
import {sessionHelper} from '../../src/storage/session-helper';
import {popupController} from '../../src/popup/popup-controller';
import * as LoadedFilesConstans from '../../src/file-history/office-loaded-file.jsx';
import {Popover} from 'antd';

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
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          < FileHistoryContainer />
        </Provider>);

    const tmp = wrappedComponent.instance();
    wrappedComponent.unmount();
    // then
    expect(tmp).toBeTruthy();

    expect(tmp._ismounted).toBeFalsy();
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
