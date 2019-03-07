/* eslint-disable no-unused-vars */
import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import {Home, _Home} from '../../src/home/home.jsx';
import {_Header} from '../../src/home/header.jsx';
import {sessionHelper} from '../../src/storage/session-helper';
import {officeApiHelper} from '../../src/office/office-api-helper';
import {reduxStore} from '../../src/store';
import {homeHelper} from '../../src/home/home-helper.js';
import {pageBuilder} from '../../src/home/page-builder.js';

jest.mock('../../src/storage/session-helper');
jest.mock('../../src/office/office-api-helper');
jest.mock('../../src/home/home-helper');

/* eslint-enable  */

describe('Home', () => {
  it('should render home component and its children', async () => {
    // given
    // when
    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <Home />
        </Provider>
    );
    // then
    expect(componentWrapper.children().length).toBeGreaterThan(0);
  });

  it('should have header component with proper text', async () => {
    // given
    const props = {
      loading: false,
      authToken: true,
      reportArray: false,
    };
    const tempPromise = Promise.resolve();
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    const officeHelperSpy = jest
        .spyOn(officeApiHelper, 'loadExistingReportBindingsExcel')
        .mockImplementation(async () => null);
    sessionHelperSpy.mockClear();
    officeHelperSpy.mockClear();
    // when
    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <_Home {...props} />
        </Provider>
    );
    // then
    setImmediate(() => tempPromise);
    await (tempPromise);
    const headerWrapper = componentWrapper.find('#app-header');
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    expect(officeHelperSpy).toHaveBeenCalled();
    expect(sessionHelperSpy).toHaveBeenCalled();
  });

  it('should properly set header values', async () => {
    // given

    // when
    const headerWrapper = mount(<_Header />);
    // then
    expect(headerWrapper.props('userInitials')).toBeTruthy();
    expect(headerWrapper.props('userFullName')).toBeTruthy();
  });

  it('should correctly render header elements', async () => {
    // given

    // when
    const headerWrapper = mount(<_Header />);
    // then
    const imageWrapper = headerWrapper.find('#profileImage');
    const nameWrapper = headerWrapper.find('.header-name');
    const buttonWrapper = headerWrapper.find('#logOut');
    expect(imageWrapper).toBeTruthy();
    expect(nameWrapper).toBeTruthy();
    expect(buttonWrapper).toBeTruthy();
  });


  it('should trigger saveLoginValues and saveTokenFromCookies on mount', () => {
    // given
    const props = {
      loading: false,
      authToken: false,
      reportArray: false,
    };
    jest.spyOn(pageBuilder, 'getPage').mockReturnValueOnce(null);
    // when
    const wrappedComponent = mount(<_Home {...props} />);
    // then
    expect(homeHelper.saveLoginValues).toBeCalled();
    expect(homeHelper.saveTokenFromCookies).toBeCalled();
  });

  it('should trigger saveTokenFromCookies on update', () => {
    // given
    const props = {
      loading: false,
      authToken: false,
      reportArray: false,
    };
    jest.spyOn(pageBuilder, 'getPage').mockReturnValue(null);
    const wrappedComponent = mount(<_Home {...props} />);
    // when
    wrappedComponent.setProps({
      ...props,
      authToken: 'new',
    });
    // then
    expect(homeHelper.saveTokenFromCookies).toBeCalledTimes(4);
  });
});
