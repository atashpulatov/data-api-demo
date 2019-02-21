/* eslint-disable */
import { authenticationService } from '../../src/authentication/auth-rest-service';
import { UnauthorizedError } from '../../src/error/unauthorized-error';
import { EnvironmentNotFoundError } from '../../src/error/environment-not-found-error';
import { moduleProxy } from '../../src/module-proxy';
import request from 'superagent';
import { errorService } from '../../src/error/error-handler';
/* eslint-enable */

const correctLogin = 'mstr';
const correctPassword = '999U2nn1g7gY';
const authType = 1;
const envURL = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

describe('AuthRestService', () => {
  describe('authenticate', () => {
    const originalAgent = request;
    beforeAll(() => {
      const mockAgent = request.agent();
      moduleProxy.request = mockAgent;
    });

    afterAll(() => {
      moduleProxy.request = originalAgent;
    });

    it('should return authToken when called', async () => {
      // given
      // when
      const authToken = await authenticationService.authenticate(
        correctLogin,
        correctPassword,
        envURL,
        authType);
      // then
      expect(authToken).toBeDefined();
      expect(authToken).toBeTruthy();
    });
    it('should throw error due to incorrect username', async () => {
      // given
      const incorrectLogin = 'mst';
      // when
      const authToken = authenticationService.authenticate(
        incorrectLogin,
        correctPassword,
        envURL,
        authType);
      // then
      try {
        await authToken;
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
      };
      expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect password', async () => {
      // given
      const incorrectPassword = 'wrongPass';
      // when
      const authToken = authenticationService.authenticate(
        correctLogin,
        incorrectPassword,
        envURL,
        authType);
      // then
      try {
        await authToken;
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
      };
      expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect login mode', async () => {
      // given
      const incorrectAuthType = 122;
      // when
      const authToken = authenticationService.authenticate(
        correctLogin,
        correctPassword,
        envURL,
        incorrectAuthType);
      // then
      try {
        await authToken;
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
      };
      expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect url but within existing domain', async () => {
      // given
      const incorrectUrl = 'https://env-94174.customer.cloud.microstrategy.com/incorecturl';
      // when
      const authToken = authenticationService.authenticate(
        correctLogin,
        correctPassword,
        incorrectUrl,
        authType);
      // then
      try {
        await authToken;
      } catch (error) {
        expect(error).toBeInstanceOf(EnvironmentNotFoundError);
      };
      expect(authToken).rejects.toThrow();
    });
    it('should throw error due to incorrect url and provided domain does not exist', async () => {
      // given
      const nonExistingDomainUrl = 'https://www.domainwhichshouldnotexist.com.pl';
      // when
      const authToken = authenticationService.authenticate(
        correctLogin,
        correctPassword,
        nonExistingDomainUrl,
        authType);
      // then
      try {
        await authToken;
      } catch (error) {
        expect(error).toBeInstanceOf(EnvironmentNotFoundError);
      };
      expect(authToken).rejects.toThrow();
    });
  });
});
