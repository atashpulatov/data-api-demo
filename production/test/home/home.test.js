/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Home, _Home } from '../../src/home/home.jsx';
import { Header } from '../../src/home/header.jsx';
import { sessionHelper } from '../../src/storage/session-helper';
import { officeApiHelper } from '../../src/office/office-api-helper';
import { reduxStore } from '../../src/store';
import { homeHelper } from '../../src/home/home-helper.js';
import { pageBuilder } from '../../src/home/page-builder.js';

jest.mock('../../src/storage/session-helper');
jest.mock('../../src/office/office-api-helper');
jest.mock('../../src/home/home-helper');

/* eslint-enable  */

describe('Home', () => {
  it('should have header component with proper text', async () => {
    // given
    const tempPromise = Promise.resolve();
    const headerWrapper = mount(<Header />);
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    const officeHelperSpy = jest
        .spyOn(officeApiHelper, 'loadExistingReportBindingsExcel')
        .mockImplementation(async () => null);
    sessionHelperSpy.mockClear();
    officeHelperSpy.mockClear();
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <Home />
      </Provider>
    );
    // then
    setImmediate(() => tempPromise);
    await (tempPromise);
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    expect(officeHelperSpy).toHaveBeenCalled();
    expect(sessionHelperSpy).toHaveBeenCalled();
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
    expect(homeHelper.saveTokenFromCookies).toBeCalledTimes(3);
  });
});
