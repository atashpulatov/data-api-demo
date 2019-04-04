/* eslint-disable */
import { mount } from 'enzyme';
import React from 'react';
import { _FileHistoryContainer } from '../../src/file-history/file-history-container';
/* eslint-enable */

describe('FileHistoryContainer', () => {
  it('should render component when we are insinde project', () => {
    // given
    // when
    const wrappedComponent = mount(
        <_FileHistoryContainer
          project={'testProject'} />
    );
    // then
    expect(wrappedComponent.html()).not.toBeNull();
  });
  it('should display "No files loaded" when there are no files', () => {
    // given
    // when
    const wrappedComponent = mount(
        <_FileHistoryContainer
          project={'testProject'} />
    );
    // then
    expect(wrappedComponent.html()).toContain('No files loaded.');
  });
  it('should display list of files when there are files', () => {
    // given
    const mockFiles = createMockFilesArray();
    // when
    const wrappedComponent = mount(
        <_FileHistoryContainer
          reportArray={mockFiles}
          project={'testProject'} />
    );
    const wrappedListElements = wrappedComponent.find('Row');
    // then
    expect(wrappedComponent.html()).not.toContain('No files loaded.');
    expect(wrappedListElements.length).toEqual(mockFiles.length);
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
