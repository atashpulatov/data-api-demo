import React from 'react';
import { shallow, mount } from 'enzyme';
import { sessionHelper } from '../../storage/session-helper';
import { SettingsMenuNotConnected } from '../../home/settings-menu';
import DB from '../../cache/cache-db';
import overflowHelper from '../../helpers/helpers';

describe('Settings Menu', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should log out on element logout click and delete the cache DB', async () => {
    // given
    const clearDB = jest.fn();
    const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest').mockImplementation(() => { });
    const indexedDBSpy = jest.spyOn(DB, 'getIndexedDBSupport').mockImplementation(() => true);
    const logOutSpy = jest.spyOn(sessionHelper, 'logOut');
    const logOutRedirectSpy = jest.spyOn(sessionHelper, 'logOutRedirect');
    const menuWrapper = mount(<SettingsMenuNotConnected clearCache={clearDB} />);
    const buttonWrapper = menuWrapper.find('#logOut');
    // when
    buttonWrapper.simulate('click');
    // then
    await expect(logOutRestSpy).toBeCalled();
    await expect(logOutSpy).toBeCalled();
    await expect(logOutRedirectSpy).toBeCalled();
    await expect(indexedDBSpy).toBeCalled();
    await expect(clearDB).toBeCalled();
  });

  it('should handle error on logout', () => {
    // given
    const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest').mockImplementation(() => {
      throw new Error();
    });
    const menuWrapper = mount(<SettingsMenuNotConnected />);
    const buttonWrapper = menuWrapper.find('#logOut');
    // when
    buttonWrapper.simulate('click');
    // then
    expect(logOutRestSpy).toThrowError();
  });

  it('should return true on throw error', () => {
    // given
    Object.defineProperty(global, 'document', {
      writable: true,
      value: {
        createElement: () => ({
          style: {}, focus: jest.fn(), select: jest.fn(),
          parentNode: { removeChild: jest.fn() }
        }),
        parentNode: { removeChild: jest.fn() },
        execCommand: jest.fn(),
        body: {
          appendChild: () => {
            throw new Error();
          },
          removeChild: jest.fn()
        }
      },
    });
    // when
    const returnValue = overflowHelper.isOverflown();
    // then
    expect(returnValue).toBe(true);
  });


  it('component should be wrapped with settings-list classname', () => {
    // given
    window.Office = {
      context: {
        ui: { messageParent: () => { }, },
        diagnostics: { host: 'host', platform: 'platform', version: 'version' },
        requirements: { isSetSupported: jest.fn() }
      }
    };
    // when"
    const menuWrapper = shallow(<SettingsMenuNotConnected userFullName="userFullName" userInitials={null} userID={1} />);
    // then
    expect(menuWrapper.props().className).toBe('settings-list');
  });
});
