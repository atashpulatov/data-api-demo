import { navigationService } from '../../navigation/navigation-service';
import { historyProperties } from '../../history/history-properties';
import { sessionProperties } from '../../storage/session-properties';
import { reduxStore } from '../../store';

describe('NavigatorService', () => {
  beforeAll(() => {
    expect(reduxStore.getState().sessionReducer.envUrl).toBeFalsy();
    expect(reduxStore.getState().sessionReducer.authToken).toBeFalsy();
  });

  it('should give a path object to authentication page', () => {
    // when
    const pathObject = navigationService.getLoginRoute();
    // then
    expect(pathObject).toBeDefined();
    expect(pathObject.pathname).toBeDefined();
    expect(pathObject.pathname).toContain('/auth');
    expect(pathObject.state).toBeDefined();
  });

  it('should give a path object to project page',
    () => {
      // when
      const pathObject = navigationService.getProjectsRoute();
      // then
      expect(pathObject.pathname).toBeDefined();
      expect(pathObject.pathname).toContain('/');
      expect(pathObject.state).not.toBeDefined();
    });


  it('should give a path object to folder contents', () => {
    // when
    const pathObject = navigationService.getObjectsRoute();
    // then
    expect(pathObject).toBeDefined();
    expect(pathObject.pathname).toBeDefined();
    expect(pathObject.pathname).toContain('/objects');
    expect(pathObject.state).not.toBeDefined();
  });

  it('should call for login route when no token', () => {
    const originalMethod = navigationService.getLoginRoute;
    // given
    try {
      const expected = { prop: 'expect', };
      navigationService.getLoginRoute = jest.fn();
      navigationService.getLoginRoute.mockReturnValueOnce(expected);
      // when
      const result = navigationService.getNavigationRoute();
      expect(result).toBeDefined();
      expect(result).toBe(expected);
    } finally {
      navigationService.getLoginRoute = originalMethod;
    }
  });

  it('should call for projects route when env and token present', () => {
    const originalMethod = navigationService.getProjectsRoute;
    // given
    try {
      reduxStore.dispatch({
        type: sessionProperties.actions.logIn,
        values: {
          username: 'usr',
          envUrl: 'env',
          isRememberMeOn: true,
        },
      });
      reduxStore.dispatch({
        type: sessionProperties.actions.loggedIn,
        authToken: 'token',
      });
      const expected = { prop: 'expect', };
      navigationService.getProjectsRoute = jest.fn();
      navigationService.getProjectsRoute.mockReturnValueOnce(expected);
      // when
      const result = navigationService.getNavigationRoute();
      expect(result).toBeDefined();
      expect(result).toBe(expected);
    } finally {
      navigationService.getProjectsRoute = originalMethod;
    }
  });

  it('should call for projects route when env, token and project present',
    () => {
      const originalMethod = navigationService.getObjectsRoute;
      // given
      try {
        reduxStore.dispatch({
          type: sessionProperties.actions.logIn,
          values: {
            username: 'usr',
            envUrl: 'env',
            isRememberMeOn: true,
          },
        });
        reduxStore.dispatch({
          type: sessionProperties.actions.loggedIn,
          authToken: 'token',
        });
        reduxStore.dispatch({
          type: historyProperties.actions.goInsideProject,
          projectId: 'id',
          projectName: 'name',
        });
        const expected = { prop: 'expect', };
        navigationService.getObjectsRoute = jest.fn();
        navigationService.getObjectsRoute.mockReturnValueOnce(expected);
        // when
        const result = navigationService.getNavigationRoute();
        expect(result).toBeDefined();
        expect(result).toBe(expected);
      } finally {
        navigationService.getObjectsRoute = originalMethod;
      }
    });
});
