/* eslint-disable */
import { mount } from 'enzyme';
import React from 'react';
import { _FileHistoryContainer } from '../../src/file-history/file-history-container';
/* eslint-enable */

describe('FileHistoryContainer', () => {
    it('should not render any component when we are not inside a project', () => {
        // given
        // when
        const wrappedComponent = mount(<_FileHistoryContainer />);
        // then
        expect(wrappedComponent.html()).toBeNull();
    });
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
    it('should display heading with text "Loaded files"', () => {
        // given
        // when
        const wrappedComponent = mount(
            <_FileHistoryContainer
                project={'testProject'} />
        );
        const wrappedHeader = wrappedComponent.find('h3');
        // then
        expect(wrappedHeader.html()).toContain('Loaded files');
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
    let mockArray = [];
    for (let i = 0; i < 6; i++) {
        mockArray.push({
            id: 'mockId_' + i,
            name: 'mockName_' + i,
            bindId: 'mockBindId_' + i,
        });
    }
    return mockArray;
}
