import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { withTranslation } from 'react-i18next';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { sessionHelper } from '../storage/session-helper';
import { homeHelper } from './home-helper';
import { toggleRenderSettingsFlag } from '../redux-reducer/office-reducer/office-actions';
import { RightSidePanel } from '../right-side-panel/right-side-panel';
import { HomeDialog } from './home-dialog';
import { Authenticate } from '../authentication/auth-component';
import { DevelopmentImportList } from '../development-import-list';
import { notificationService } from '../notification-v2/notification-service';
import officeStoreRestoreObject from '../office/store/office-store-restore-object';
import { SessionExtendingWrapper } from '../popup/session-extending-wrapper';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import InternetConnectionError from '../popup/internet-connection-error';

const IS_DEVELOPMENT = sessionHelper.isDevelopment();

export const HomeNotConnected = (props) => {
  const {
    loading, popupOpen, authToken, t
  } = props;

  React.useEffect(() => {
    const handleConnectionRestored = () => notificationService.connectionRestored();
    const handleConnectionLost = () => notificationService.connectionLost();
    window.addEventListener('online', handleConnectionRestored);
    window.addEventListener('offline', handleConnectionLost);
    return (() => window.removeEventListener('online', handleConnectionRestored),
    () => window.removeEventListener('offline', handleConnectionLost));
  });

  useEffect(() => {
    try {
      officeStoreRestoreObject.restoreObjectsFromExcelStore();
      homeHelper.saveLoginValues();
      homeHelper.saveTokenFromCookies();
      sessionActions.disableLoading();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getUserData(authToken);
  }, [authToken]);

  return (
    <SessionExtendingWrapper id="overlay">
      {IS_DEVELOPMENT && authToken && <DevelopmentImportList />}
      {authToken
        ? <RightSidePanel />
        : (
          <Spin spinning={loading}>
            {IS_DEVELOPMENT && <Authenticate />}
          </Spin>
        )}
      <HomeDialog show={popupOpen} text={t('A MicroStrategy for Office Add-in dialog is open')} />
    </SessionExtendingWrapper>
  );
};

async function getUserData(authToken) {
  if (authToken) {
    console.log('saving token');
    homeHelper.saveTokenFromCookies();
    await sessionHelper.getUserInfo();
    await sessionHelper.getUserAttributeFormPrivilege();
  }
}

function mapStateToProps(state) {
  return {
    loading: state.sessionReducer.loading,
    popupOpen: state.officeReducer.popupOpen,
    authToken: state.sessionReducer.authToken,
    shouldRenderSettings: state.officeReducer.shouldRenderSettings,
  };
}

const mapDispatchToProps = { toggleRenderSettingsFlag, };

HomeNotConnected.propTypes = {
  loading: PropTypes.bool,
  popupOpen: PropTypes.bool,
  authToken: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  t: PropTypes.func,
};

HomeNotConnected.defaultProps = { t: (text) => text, };

export const Home = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(HomeNotConnected));
