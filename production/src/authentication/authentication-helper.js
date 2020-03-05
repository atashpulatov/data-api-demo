class AuthenticationHelper {
  init = (reduxStore, sessionHelper, authenticationService, errorService) => {
    this.reduxStore = reduxStore;
    this.sessionHelper = sessionHelper;
    this.authenticationService = authenticationService;
    this.errorService = errorService;
  }

  loginUser = async (err, values) => {
    if (err) {
      return;
    }
    try {
      this.sessionHelper.enableLoading();
      this.sessionHelper.saveLoginValues(values);
      const authToken = await this.authenticationService
        .authenticate(values.username, values.password, values.envUrl, values.loginMode || 1);
      this.sessionHelper.logIn(authToken);
    } catch (error) {
      this.errorService.handleError(error, { isLogout: true });
    } finally {
      this.sessionHelper.disableLoading();
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
