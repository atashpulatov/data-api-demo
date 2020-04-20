class AuthenticationHelper {
  init = (reduxStore, sessionActions, authenticationService, errorService) => {
    this.reduxStore = reduxStore;
    this.sessionActions = sessionActions;
    this.authenticationService = authenticationService;
    this.errorService = errorService;
  }

  loginUser = async (err, values) => {
    if (err) {
      return;
    }
    try {
      this.sessionActions.enableLoading();
      this.sessionActions.saveLoginValues(values);
      const authToken = await this.authenticationService
        .authenticate(values.username, values.password, values.envUrl, values.loginMode || 1);
      this.sessionActions.logIn(authToken);
    } catch (error) {
      this.errorService.handleError(error, { isLogout: true });
    } finally {
      this.sessionActions.disableLoading();
    }
  }

  validateAuthToken = () => {
    const reduxStoreState = this.reduxStore.getState();
    const { authToken } = reduxStoreState.sessionReducer;
    const { envUrl } = reduxStoreState.sessionReducer;
    return this.authenticationService.putSessions(envUrl, authToken);
  }
}

export const authenticationHelper = new AuthenticationHelper();
