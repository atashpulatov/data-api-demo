// TODO: Rewrite tests
/* eslint-disable jest/no-disabled-tests */
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Home, HomeNotConnected } from '../../home/home';
import { reduxStore } from '../../store';
import { homeHelper } from '../../home/home-helper';
import { sessionHelper } from '../../storage/session-helper';

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

  it('should trigger saveLoginValues and getTokenFromStorage on mount', async () => {
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
    expect(homeHelper.getTokenFromStorage).toBeCalled();
  });

  it('should trigger getTokenFromStorage on update', async () => {
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
    expect(homeHelper.getTokenFromStorage).toBeCalled();
  });

  it.skip('should contain 3 child nodes and should be child of content', () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,
    };
    sessionHelper.isDevelopment = jest.fn().mockReturnValue(false);

    // when
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <HomeNotConnected {...props} />
      </Provider>
    );
    const overlayId = '#overlay';
    // then
    expect(wrappedComponent.exists('SessionExtendingWrapper')).toBeTruthy();
    expect(wrappedComponent.find(overlayId).exists('HomeDialog')).toBeTruthy();
    expect(wrappedComponent.find(overlayId).exists('Spin')).toBeTruthy();
    expect(wrappedComponent.find(overlayId).exists('SessionExtendingWrapper')).toBeTruthy();
    expect(wrappedComponent.find(overlayId).children()).toHaveLength(3);
  });

  it('should contain all assigned props and return true on toBeDefined', () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,
    };

    // when
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <HomeNotConnected {...props} />
      </Provider>,
    );
    const overlayId = '#overlay';

    // then
    const overlayWrapper = wrappedComponent.find(overlayId).at(1);
    expect(overlayWrapper.props().role).toEqual('none');
  });
});
