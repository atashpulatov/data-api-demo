import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import {reduxStore} from '../../src/store';
import {LoadingPage} from '../../src/loading/loading-page';


describe('Loading page', () => {
  it('should render loading page component and its children', async () => {
    // given
    // when
    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <LoadingPage />
        </Provider>
    );
    // then
    expect(componentWrapper.children().length).toBeGreaterThan(0);
  });

  it('should display default loading title', async () => {
    // given
    const expectedTitle = 'Data Import';
    // when
    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <LoadingPage />
        </Provider>
    );
    // then
    const headerWrapper = componentWrapper.find('h1');
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    expect(headerWrapper.text()).toContain(expectedTitle);
  });
  it('should display loading title from props', async () => {
    // given
    const mockedTitle = 'Some report name';
    // when
    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <LoadingPage title={mockedTitle} />
        </Provider>
    );
    // then
    const headerWrapper = componentWrapper.find('h1');
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    expect(headerWrapper.text()).toContain(mockedTitle);
  });
  it('should display spinner component', async () => {
    // given
    // when
    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <LoadingPage />
        </Provider>
    );
    // then
    const headerWrapper = componentWrapper.find('img');
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
  });
});
