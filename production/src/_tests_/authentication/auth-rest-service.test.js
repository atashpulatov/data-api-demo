import {authenticationService} from '../../authentication/auth-rest-service';
import {UnauthorizedError} from '../../error/unauthorized-error';
import {EnvironmentNotFoundError} from '../../error/environment-not-found-error';
import {moduleProxy} from '../../module-proxy';
import request from 'superagent';
import {errorService} from '../../error/error-handler';

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
    // Office privilege only exists in >11.1.0200
    it.skip('should return office privilege when called', async () => {
      // given
      const authToken = await authenticationService.authenticate(
          correctLogin,
          correctPassword,
          envURL,
          authType);
      // when
      const canUseOffice = await authenticationService.getOfficePrivilege(envURL, authToken);
      // then
      expect(canUseOffice).toBeDefined();
      expect(canUseOffice).toBeInstanceOf(Boolean);
    });
    it('should return office privilege true when error or not supported', async () => {
      // given
      const envUrl = 'incorrectURL';
      const authToken = 'incorrectAuthToken';
      // when
      const canUseOffice = await authenticationService.getOfficePrivilege(envUrl, authToken);
      // then
      expect(canUseOffice).toBeDefined();
      expect(canUseOffice).toBeTruthy();
    });
  });
});
