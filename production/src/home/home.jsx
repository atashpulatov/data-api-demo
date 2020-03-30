import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { withTranslation } from 'react-i18next';
import { Spin } from 'antd';
import { sessionHelper } from '../storage/session-helper';
import { homeHelper } from './home-helper';
import { toggleRenderSettingsFlag } from '../office/store/office-actions';
import { officeStoreService } from '../office/store/office-store-service';
import { RightSidePanel } from '../right-side-panel/right-side-panel';
import { HomeDialog } from './home-dialog';
import InternetConnectionError from '../popup/internet-connection-error';
import { Authenticate } from '../authentication/auth-component';
import HomeContent from './home-content';
import { DevelopmentImportList } from '../development-import-list';

const IS_LOCALHOST = sessionHelper.isDevelopment();

export const HomeNotConnected = (props) => {
  const {
    loading, popupOpen, authToken, shouldRenderSettings, t
  } = props;
  React.useEffect(() => {
    try {
      officeStoreService.restoreObjectsFromExcelStore();
      // // TODO: remove below
      // await officeStoreService.loadExistingReportBindingsExcel();
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
      {!popupOpen && <InternetConnectionError />}
      <HomeDialog show={popupOpen} text={t('A MicroStrategy for Office Add-in dialog is open')} />
      {/* <HomeContent {...props} /> */}
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

HomeNotConnected.defaultProps = { t: (text) => text, };

export const Home = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(HomeNotConnected));
