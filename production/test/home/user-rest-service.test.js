import {userRestService} from '../../src/home/user-rest-service';
import {UnauthorizedError} from '../../src/error/unauthorized-error';
import {mount} from 'enzyme';
import {sessionHelper} from '../../src/storage/session-helper';
import {_Header} from '../../src/home/header.jsx';
import React from 'react';

const envURL = 'https://env-156567.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('getUserInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should save userData', async () => {
    // given
    const givenUserData = {userFullName: 'name1', userInitials: 'n'};
    const userDataMock = jest.spyOn(userRestService, 'getUserInfo').mockResolvedValueOnce(givenUserData);
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'getUserInfo');
    const tempPromise = Promise.resolve();
    // when
    const headerWrapper = mount(<_Header />);
    headerWrapper.setProps({userFullName: null});
    await headerWrapper.instance().componentDidMount();
    // then
    await (tempPromise);
    expect(userDataMock).toBeCalled();
    expect(sessionHelperSpy).toBeCalled();
  });

  it('should not replace alredy saved userData', async () => {
    // given
    const givenUserData = {userFullName: 'name2', userInitials: 'n'};
    const userDataMock = jest.spyOn(userRestService, 'getUserInfo').mockResolvedValueOnce(givenUserData);
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'saveUserInfo');
    const tempPromise = Promise.resolve();
    // when
    const headerWrapper = mount(<_Header />);
    headerWrapper.setProps({userFullName: 'name'});
    await headerWrapper.instance().componentDidMount();
    // then
    await (tempPromise);
    expect(userDataMock).toBeCalled();
    expect(sessionHelperSpy).not.toBeCalled();
  });
  it.skip('should throw error due to incorrect token', async () => {
    // given
    const givenAuthToken = 'token';
    // when
    const userData = userRestService.getUserInfo(givenAuthToken, envURL);
    // then
    try {
      await userData;
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    };
    expect(userData).rejects.toThrow();
  });
});
