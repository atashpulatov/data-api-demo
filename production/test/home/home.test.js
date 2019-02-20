/* eslint-disable no-unused-vars */
import React from 'react';
import {Provider} from 'react-redux';
import {shallow, mount} from 'enzyme';
import {Home, _Home} from '../../src/home/home.jsx';
import {Header} from '../../src/home/header.jsx';
import {sessionHelper} from '../../src/storage/session-helper';
import {officeApiHelper} from '../../src/office/office-api-helper';
import {reduxStore} from '../../src/store';

jest.mock('../../src/storage/session-helper');
jest.mock('../../src/office/office-api-helper');

/* eslint-enable  */

describe('Home', () => {
  it('should have header component with proper text', async () => {
    // given
    const tempPromise = Promise.resolve();
    const headerWrapper = mount(<Header />);
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    const officeHelperSpy = jest
        .spyOn(officeApiHelper, 'loadExistingReportBindingsExcel')
        .mockImplementation( async () => null);
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
    await(tempPromise);
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    expect(officeHelperSpy).toHaveBeenCalled();
    expect(sessionHelperSpy).toHaveBeenCalled();
  });

  it('should try to login user', () => {
    // given
    const props = {
      loading: false,
      authToken: false,
      reportArray: false,
    };
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'logIn');
    const componentWrapper = shallow(<_Home {...props} />);
    componentWrapper.instance().getCookiesToArray = () => [{name: ' iSession', value: 'token'}];
    // when
    componentWrapper.instance().saveTokenFromCookies();
    // then
    expect(sessionHelperSpy).toHaveBeenCalledWith('token');
  });

  it('should save tokens from cookies after update', () => {
    // given
    const props = {
      loading: false,
      authToken: false,
      reportArray: false,
    };
    const componentWrapper = shallow(<_Home {...props} />);
    const saveTokenSpy = jest.spyOn(componentWrapper.instance(), 'saveTokenFromCookies');
    saveTokenSpy.mockClear();
    // when
    componentWrapper.setState({});
    // then
    expect(saveTokenSpy).toHaveBeenCalled();
  });
});
