import {userRestService} from '../../src/home/user-rest-service';
import {UnauthorizedError} from '../../src/error/unauthorized-error';
import {mount} from 'enzyme';
import {sessionHelper} from '../../src/storage/session-helper';
import {_Header} from '../../src/home/header.jsx';
import React from 'react';

const envURL = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('getUserData', () => {
  it('should save userData', async () => {
    // given
    const givenUserData = 'body';
    const userDataMock = jest.spyOn(userRestService, 'getUserData').mockResolvedValueOnce(givenUserData);
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'saveUserInfo');
    const tempPromise = Promise.resolve();
    // when
    const headerWrapper = mount(<_Header />);
    // then
    await (tempPromise);
    expect(userDataMock).toBeCalled();
    expect(sessionHelperSpy).toBeCalled();
  });
  it('should throw error due to incorrect token', async () => {
    // given
    const givenAuthToken = 'token';
    // when
    const userData = userRestService.getUserData(givenAuthToken, envURL);
    // then
    try {
      await userData;
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    };
    expect(userData).rejects.toThrow();
  });
});
