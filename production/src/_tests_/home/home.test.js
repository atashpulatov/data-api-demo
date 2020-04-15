import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Home, HomeNotConnected } from '../../home/home';
import { reduxStore } from '../../store';
import { homeHelper } from '../../home/home-helper';

jest.mock('../../storage/session-helper');
jest.mock('../../office/store/office-store-restore-object');
jest.mock('../../home/home-helper');

describe('Home', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render home component and its children', () => {
    // given
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <Home />
      </Provider>,
    );
    // then
    expect(componentWrapper.children().length).toBeGreaterThan(0);
  });

  it('should trigger saveLoginValues and saveTokenFromCookies on mount', async () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,
    };
    const tempPromise = Promise.resolve();
    // when
    mount(<Provider store={reduxStore}><Home {...props} /></Provider>);
    // then
    await (tempPromise);
    expect(homeHelper.saveLoginValues).toBeCalled();
    expect(homeHelper.saveTokenFromCookies).toBeCalled();
  });

  it('should trigger saveTokenFromCookies on update', async () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,

    };

    const tempPromise = Promise.resolve();
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <HomeNotConnected {...props} />
      </Provider>,
    );
    // when
    wrappedComponent.setProps({
      ...props,
      authToken: 'new',
    });
    // then
    await (tempPromise);
    expect(homeHelper.saveTokenFromCookies).toBeCalled();
  });
});
