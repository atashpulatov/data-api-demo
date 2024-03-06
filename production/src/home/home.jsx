// issue with proptype import
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Spinner } from "@mstr/rc";

import PropTypes from "prop-types";
import useOfficePrivilege from "../hooks/use-office-privilege";

import { notificationService } from "../notification-v2/notification-service";
import { sessionHelper } from "../storage/session-helper";
import { homeHelper } from "./home-helper";

import officeStoreRestoreObject from "../office/store/office-store-restore-object";

import { Authenticate } from "../authentication/auth-component";
import { DevelopmentImportList } from "../development-import-list";
import i18n from "../i18n";
import { SessionExtendingWrapper } from "../popup/session-extending-wrapper";
import { officeActions } from "../redux-reducer/office-reducer/office-actions";
import { popupStateActions } from "../redux-reducer/popup-state-reducer/popup-state-actions";
import { sessionActions } from "../redux-reducer/session-reducer/session-actions";
import PrivilegeErrorSidePanel from "../right-side-panel/info-panels/privilege-error-side-panel";
import { RightSidePanel } from "../right-side-panel/right-side-panel";
import { HomeDialog } from "./home-dialog";

import "./home.css";

const IS_DEVELOPMENT = sessionHelper.isDevelopment();

async function getUserData(authToken) {
  if (authToken) {
    homeHelper.getTokenFromStorage();
    await sessionHelper.getUserInfo();
    await sessionHelper.getUserAttributeFormPrivilege();
  }
}

export const HomeNotConnected = (props) => {
  const {
    loading,
    isDialogOpen,
    authToken,
    hideDialog,
    toggleIsSettingsFlag,
    clearDialogState,
  } = props;

  const canUseOffice = useOfficePrivilege(authToken);

  const [t] = useTranslation("common", { i18n });

  const handleConnectionRestored = () => {
    notificationService.connectionRestored();
  };
  const handleConnectionLost = () => {
    if (!isDialogOpen) {
      notificationService.connectionLost();
    }
  };

  useEffect(() => {
    window.addEventListener("online", handleConnectionRestored);
    window.addEventListener("offline", handleConnectionLost);
    return (
      () => window.removeEventListener("online", handleConnectionRestored),
      () => window.removeEventListener("offline", handleConnectionLost)
    );
  });

  useEffect(() => {
    if (!isDialogOpen && !window.navigator.onLine) {
      notificationService.connectionLost();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (!authToken) {
      notificationService.sessionRestored();
    }
  });

  useEffect(() => {
    function initializeHome() {
      try {
        // initialize shape API support status in store
        homeHelper.initIsShapeAPISupported();
        officeStoreRestoreObject.restoreObjectsFromExcelStore();
        officeStoreRestoreObject.restoreAnswersFromExcelStore();
        homeHelper.saveLoginValues();
        homeHelper.getTokenFromStorage();
        hideDialog(); // hide error popup if visible
        toggleIsSettingsFlag(false); // hide settings menu if visible
        clearDialogState();
        sessionActions.disableLoading();
      } catch (error) {
        console.error(error);
      }
    }
    initializeHome();
  }, [hideDialog, toggleIsSettingsFlag, clearDialogState]);

  useEffect(() => {
    getUserData(authToken);
  }, [authToken]);

  const renderAuthenticatePage = () =>
    loading ? (
      <Spinner text="Loading" textPosition="RIGHT" />
    ) : (
      IS_DEVELOPMENT && <Authenticate />
    );

  const sidePanelToRender = () => {
    if (authToken) {
      if (canUseOffice) {
        return <RightSidePanel />;
      }
      return <PrivilegeErrorSidePanel />;
    }
    return renderAuthenticatePage();
  };

  return (
    <SessionExtendingWrapper id="overlay">
      {IS_DEVELOPMENT && authToken && <DevelopmentImportList />}
      {sidePanelToRender()}
      <HomeDialog
        show={isDialogOpen}
        text={t("A MicroStrategy for Office Add-in dialog is open")}
      />
    </SessionExtendingWrapper>
  );
};

function mapStateToProps(state) {
  return {
    loading: state.sessionReducer.loading,
    isDialogOpen: state.officeReducer.isDialogOpen,
    authToken: state.sessionReducer.authToken,
    shouldRenderSettings: state.officeReducer.shouldRenderSettings,
    canUseOffice: state.sessionReducer.canUseOffice,
  };
}

const mapDispatchToProps = {
  toggleRenderSettingsFlag: officeActions.toggleRenderSettingsFlag,
  hideDialog: officeActions.hideDialog,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  clearDialogState: popupStateActions.onClearPopupState,
};

HomeNotConnected.propTypes = {
  loading: PropTypes.bool,
  isDialogOpen: PropTypes.bool,
  authToken: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hideDialog: PropTypes.func,
  toggleIsSettingsFlag: PropTypes.func,
  clearDialogState: PropTypes.func,
};

export const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeNotConnected);
