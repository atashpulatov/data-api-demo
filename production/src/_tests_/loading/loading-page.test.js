import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { reduxStore } from '../../store';
import { LoadingPage } from '../../loading/loading-page';
import { START_REPORT_LOADING } from '../../redux-reducer/popup-reducer/popup-actions';


describe('Loading page', () => {
  it('should render loading page component and its children', () => {
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

  it('should display default loading title', () => {
    // given
    const expectedTitle = 'Importing data';
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
  it('should display current loading title from redux state', () => {
    // given
    const mockedTitle = 'Some report name';
    reduxStore.dispatch({
      type: START_REPORT_LOADING,
      data: { name: mockedTitle, },
    });
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <LoadingPage name={mockedTitle} />
      </Provider>
    );
    // then
    const headerWrapper = componentWrapper.find('h1');
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    expect(headerWrapper.text()).toContain(mockedTitle);
  });
  it('should display spinner component', () => {
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
