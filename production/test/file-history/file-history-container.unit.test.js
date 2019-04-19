import {mount} from 'enzyme';
import React from 'react';
import {Provider} from 'react-redux';
import {reduxStore} from '../../src/store';
import {_FileHistoryContainer} from '../../src/file-history/file-history-container';

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
            refreshAll={refreshAllmock} />
        </Provider>);
    const refreshButton = wrappedComponent.find('Button .refresh-all-btn');
    // when
    refreshButton.simulate('click');
    // then
    expect(refreshAllmock).toBeCalled();
  });
});

const createMockFilesArray = () => {
  const mockArray = [];
  for (let i = 0; i < 6; i++) {
    mockArray.push({
      id: 'mockId_' + i,
      name: 'mockName_' + i,
      bindId: 'mockBindId_' + i,
    });
  }
  return mockArray;
};
