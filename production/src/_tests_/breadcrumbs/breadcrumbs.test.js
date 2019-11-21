import React from 'react';
import { mount } from 'enzyme';
import { _Breadcrumbs } from '../../breadcrumbs/breadcrumbs.jsx';
import { breadcrumbsService } from '../../breadcrumbs/breadcrumb-service';

describe('Breadcrumbs', () => {
  const originalMethod = breadcrumbsService.getHistoryObjects;
  beforeAll(() => {
    breadcrumbsService.getHistoryObjects = jest.fn();
  });
  afterAll(() => {
    breadcrumbsService.getHistoryObjects = originalMethod;
  });
  it('should not render breadcrumbs', () => {
    // given
    breadcrumbsService.getHistoryObjects.mockImplementation(() => []);
    // when
    const componentWrapper = mount(<_Breadcrumbs />);
    // then
    expect(componentWrapper.html()).toBeNull();
  });
  it('should render two breadcrumbs', () => {
    // given
    breadcrumbsService.getHistoryObjects.mockImplementation(() => [
      {
        projectId: 'testProjectId',
        projectName: 'testProjectName',
      },
      {
        dirId: 'testDirId1',
        dirName: 'testDirName1',
      },
    ]);
    // when
    const componentWrapper = mount(<_Breadcrumbs />);
    // then
    const breadcrumbContainer = componentWrapper.find('BreadcrumbItem');
    expect(breadcrumbContainer).toHaveLength(2);
  });
  it('should render 100 breadcrumbs', () => {
    // given
    breadcrumbsService.getHistoryObjects.mockImplementation(() => breadCrumbsGenerator(100));
    // when
    const componentWrapper = mount(<_Breadcrumbs />);
    // then
    const breadcrumbContainer = componentWrapper.find('BreadcrumbItem');
    expect(breadcrumbContainer).toHaveLength(100);
  });
});

function breadCrumbsGenerator(count) {
  const breadcrumbArray = [
    {
      projectId: 'testProjectId',
      projectName: 'testProjectName',
    },
  ];
  for (let i = 0; i < count - 1; i++) {
    breadcrumbArray.push({
      dirId: `testDirId${i}`,
      dirName: `testDirName${i}`,
    });
  }
  return breadcrumbArray;
}
