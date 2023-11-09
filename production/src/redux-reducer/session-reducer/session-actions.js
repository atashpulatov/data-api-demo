import { sessionProperties } from './session-properties';

class SessionActions {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  saveLoginValues = (values) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.logIn,
      values,
    });
  };

  logIn = (authToken) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.loggedIn,
      authToken,
    });
  };

  enableLoading = () => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading: true,
    });
  };

  disableLoading = () => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setLoading,
      loading: false,
    });
  };

  logOut = () => {
    this.reduxStore.dispatch({ type: sessionProperties.actions.logOut, });
  };

  saveUserInfo = (values) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.getUserInfo,
      userFullName: values.fullName,
      userInitials: values.initials,
      userID: values.id,
    });
  };

  setAttrFormPrivilege = (value) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setAttrFormPrivilege,
      attrFormPrivilege: value,
    });
  };

  setDialog = (dialog) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setDialog,
      dialog,
    });
  };

  setCanUseOffice = (value) => {
    this.reduxStore.dispatch({
      type: sessionProperties.actions.setCanUseOffice,
      canUseOffice: value,
    });
  };
}

export const sessionActions = new SessionActions();
