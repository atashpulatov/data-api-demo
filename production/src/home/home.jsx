import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './home.css';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Spinner } from '@mstr/rc';
import i18n from '../i18n';
import { sessionHelper } from '../storage/session-helper';
import { homeHelper } from './home-helper';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { RightSidePanel } from '../right-side-panel/right-side-panel';
import { HomeDialog } from './home-dialog';
import { Authenticate } from '../authentication/auth-component';
import { DevelopmentImportList } from '../development-import-list';
import { notificationService } from '../notification-v2/notification-service';
import officeStoreRestoreObject from '../office/store/office-store-restore-object';
import { SessionExtendingWrapper } from '../popup/session-extending-wrapper';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';

const IS_DEVELOPMENT = sessionHelper.isDevelopment();

export const HomeNotConnected = (props) => {
  const {
    loading, popupOpen, authToken, hidePopup, toggleIsSettingsFlag
  } = props;

  const [t] = useTranslation('common', { i18n });

  const handleConnectionRestored = () => {
    notificationService.connectionRestored();
  };
  const handleConnectionLost = () => {
    if (!popupOpen) {
      notificationService.connectionLost();
    }
  };

  useEffect(() => {
    window.addEventListener('online', handleConnectionRestored);
    window.addEventListener('offline', handleConnectionLost);
    return (() => window.removeEventListener('online', handleConnectionRestored),
    () => window.removeEventListener('offline', handleConnectionLost));
  },);

  useEffect(() => {
    if (!popupOpen && !window.navigator.onLine) {
      notificationService.connectionLost();
    }
  }, [popupOpen]);

  useEffect(() => {
    if (!authToken) {
      notificationService.sessionRestored();
    }
  });

  useEffect(() => {
    function initializeHome() {
      try {
        officeStoreRestoreObject.restoreObjectsFromExcelStore();
        officeStoreRestoreObject.restoreAnswersFromExcelStore();
        homeHelper.saveLoginValues();
        homeHelper.getTokenFromStorage();
        hidePopup(); // hide error popup if visible
        toggleIsSettingsFlag(false); // hide settings menu if visible
        sessionActions.disableLoading();
      } catch (error) {
        console.error(error);
      }
    }
    initializeHome();
  }, [hidePopup, toggleIsSettingsFlag]);

  useEffect(() => {
    getUserData(authToken);
  }, [authToken]);

  const renderAuthenticatePage = () => (loading ? <Spinner text="Loading" textPosition="RIGHT" /> : (IS_DEVELOPMENT && <Authenticate />));

  return (
    <SessionExtendingWrapper id="overlay">
      {IS_DEVELOPMENT && authToken && <DevelopmentImportList />}
      {authToken
        ? <RightSidePanel />
        : renderAuthenticatePage()}
      <HomeDialog show={popupOpen} text={t('A MicroStrategy for Office Add-in dialog is open')} />
    </SessionExtendingWrapper>
  );
};

async function getUserData(authToken) {
  if (authToken) {
    homeHelper.getTokenFromStorage();
    await sessionHelper.getUserInfo();
    await sessionHelper.getUserAttributeFormPrivilege();

    // TODO add privilege to state and display correct UI
    const hasPrivilege = await sessionHelper.getCanUseOfficePrivilege();
    console.log('🚀 ~ file: home.jsx:97 ~ getUserData ~ hasPrivilege:', hasPrivilege);
    // TODO get and set canUseOfficePrivilege
  }
}

function mapStateToProps(state) {
  return {
    loading: state.sessionReducer.loading,
    popupOpen: state.officeReducer.popupOpen,
    authToken: state.sessionReducer.authToken,
    shouldRenderSettings: state.officeReducer.shouldRenderSettings
  };
}

const mapDispatchToProps = {
  toggleRenderSettingsFlag: officeActions.toggleRenderSettingsFlag,
  hidePopup: officeActions.hidePopup,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag
};

HomeNotConnected.propTypes = {
  loading: PropTypes.bool,
  popupOpen: PropTypes.bool,
  authToken: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hidePopup: PropTypes.func,
  toggleIsSettingsFlag: PropTypes.func
};

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeNotConnected);
