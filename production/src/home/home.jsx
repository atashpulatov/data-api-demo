import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { withTranslation } from 'react-i18next';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { sessionHelper } from '../storage/session-helper';
import { homeHelper } from './home-helper';
import { toggleRenderSettingsFlag } from '../office/store/office-actions';
import { RightSidePanel } from '../right-side-panel/right-side-panel';
import { HomeDialog } from './home-dialog';
import { Authenticate } from '../authentication/auth-component';
import { DevelopmentImportList } from '../development-import-list';
import { notificationService } from '../notification-v2/notification-service';
import officeStoreRestoreObject from '../office/store/office-store-restore-object';

const IS_LOCALHOST = sessionHelper.isDevelopment();

export const HomeNotConnected = (props) => {
  const {
    loading, popupOpen, authToken, shouldRenderSettings, t
  } = props;

  React.useEffect(() => {
    const handleConnectionChange = () => (window.navigator.onLine
      ? notificationService.connectionRestored()
      : !popupOpen && notificationService.connectionLost());
    handleConnectionChange();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    return (() => window.removeEventListener('online', handleConnectionChange),
    () => window.removeEventListener('offline', handleConnectionChange));
  },);

  React.useEffect(() => {
    try {
      officeStoreRestoreObject.restoreObjectsFromExcelStore();
      homeHelper.saveLoginValues();
      homeHelper.saveTokenFromCookies();
      sessionHelper.disableLoading();
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    console.log('saving token');
    homeHelper.saveTokenFromCookies();
    sessionHelper.getUserInfo();
    sessionHelper.getUserAttributeFormPrivilege();
  }, [authToken]);

  return (
    <>
      {sessionHelper.isDevelopment && authToken && <DevelopmentImportList />}
      {authToken
        ? <RightSidePanel />
        : (
          <Spin spinning={loading}>
            {IS_LOCALHOST && <Authenticate />}
          </Spin>
        )}
      <HomeDialog show={popupOpen} text={t('A MicroStrategy for Office Add-in dialog is open')} />
    </>
  );
};

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
  shouldRenderSettings: PropTypes.bool,
  t: PropTypes.func,
};

HomeNotConnected.defaultProps = { t: (text) => text, };

export const Home = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(HomeNotConnected));
