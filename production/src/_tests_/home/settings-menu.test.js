import React from 'react';
import { mount } from 'enzyme';
import { sessionHelper } from '../../storage/session-helper';
import { _SettingsMenu } from '../../home/settings-menu';
import { Office } from '../mockOffice';

describe('Settings Menu', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should log out on element logout click and delete the cache DB', async () => {
    // given
    const clearDB = jest.spyOn(sessionHelper, 'clearDB').mockImplementation(() => { });
    const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest').mockImplementation(() => { });
    const logOutSpy = jest.spyOn(sessionHelper, 'logOut');
    const logOutRedirectSpy = jest.spyOn(sessionHelper, 'logOutRedirect');
    const menuWrapper = mount(<_SettingsMenu />);
    const buttonWrapper = menuWrapper.find('#logOut');
    // when
    buttonWrapper.simulate('click');
    // then
    await expect(clearDB).toBeCalled();
    await expect(logOutRestSpy).toBeCalled();
    await expect(logOutSpy).toBeCalled();
    await expect(logOutRedirectSpy).toBeCalled();
  });

  it('should handle error on logout', async () => {
    // given
    const logOutRestSpy = jest.spyOn(sessionHelper, 'logOutRest').mockImplementation(() => {
      throw new Error();
    });
    const menuWrapper = mount(<_SettingsMenu />);
    const buttonWrapper = menuWrapper.find('#logOut');
    // when
    buttonWrapper.simulate('click');
    // then
    expect(logOutRestSpy).toThrowError();
  });
});
