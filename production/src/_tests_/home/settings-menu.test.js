import React from 'react';
import { mount } from 'enzyme';
import { sessionHelper } from '../../storage/session-helper';
import { SettingsMenuHOC } from '../../home/settings-menu';
import DB from '../../cache/pouch-db';

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
    const menuWrapper = mount(<SettingsMenuHOC clearCache={clearDB} />);
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
    const menuWrapper = mount(<SettingsMenuHOC />);
    const buttonWrapper = menuWrapper.find('#logOut');
    // when
    buttonWrapper.simulate('click');
    // then
    expect(logOutRestSpy).toThrowError();
  });
});
