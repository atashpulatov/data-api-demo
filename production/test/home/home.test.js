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


describe('Home', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

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

  it('should trigger saveLoginValues and saveTokenFromCookies on mount', async () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,
    };
    jest.spyOn(pageBuilder, 'getPage').mockReturnValueOnce(null);
    const tempPromise = Promise.resolve();
    // when
    const wrappedComponent = mount(<_Home {...props} />);
    // then
    await (tempPromise);
    expect(homeHelper.saveLoginValues).toBeCalled();
    expect(homeHelper.saveTokenFromCookies).toBeCalled();
  });

  it('should trigger saveTokenFromCookies on update', () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,

    };
    const wrappedComponent = mount(
        <Provider store={reduxStore}>
          <_Home {...props} />
        </Provider>
    );
    // when
    wrappedComponent.setProps({
      ...props,
      authToken: 'new',
    });
    // then
    expect(homeHelper.saveTokenFromCookies).toBeCalled();
  });
  describe('Header', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should properly set header values', async () => {
      // given
      // when
      const headerWrapper = mount(<_Header />);
      // then
      expect(headerWrapper.props('userInitials')).toBeTruthy();
      expect(headerWrapper.props('userFullName')).toBeTruthy();
    });
    it('should properly set header values on localhost', async () => {
      // given
      // when
      const homeWrapper = mount(
          <Provider store={reduxStore}>
            <Home />
          </Provider>
      );
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
    it('should log out on button click', async () => {
      // given
      const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest');
      const logOutSpy = jest.spyOn(sessionHelper, 'logOut');
      const logOutRedirectSpy = jest.spyOn(sessionHelper, 'logOutRedirect');
      // when
      const headerWrapper = mount(<_Header />);
      const buttonWrapper = headerWrapper.find('#logOut').at(0);
      buttonWrapper.simulate('click');
      // then
      expect(logOutRestSpy).toBeCalled();
      expect(logOutSpy).toBeCalled();
      expect(logOutRedirectSpy).toBeCalled();
    });
    it('should handle error on logout', async () => {
      // given
      const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest').mockImplementation(() => {
        throw new Error();
      });
      // when
      const headerWrapper = mount(<_Header />);
      const buttonWrapper = headerWrapper.find('#logOut').at(0);
      buttonWrapper.simulate('click');
      // then
      expect(logOutRestSpy).toThrowError();
    });
  });
});
