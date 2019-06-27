import React from 'react';
import {mount} from 'enzyme';
import {_PromptsWindow} from '../../src/prompts/prompts-window';

describe('NavigationTree', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it.skip('should render with props given', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
      reportId: 'reportId',
    };
    // when
    const wrappedComponent = mount(<_PromptsWindow mstrData={mstrData} />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('PromptsContainer').get(0)).toBeDefined();
    expect(wrappedComponent.find('PromptWindowButtons').length).toBe(1);
  });
});
