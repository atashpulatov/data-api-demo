import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import Header from './header';
import { FileHistoryContainer } from '../file-history/file-history-container';
import { Notifications } from '../notification/notifications';
import { Authenticate } from '../authentication/auth-component';
import { Placeholder } from './placeholder';
import { HomeDialog } from './home-dialog';
import { Tabs } from './tabs';
import SettingsComponent from '../settings/settings-component';
import InternetConnectionError from '../popup/internet-connection-error';
import { sessionHelper } from '../storage/session-helper';

const IS_LOCALHOST = sessionHelper.isDevelopment();

export default function HomeContent({
  loading, loadingReport, authToken, reportArray, popupOpen, shouldRenderSettings,
  toggleRenderSettingsFlag, t,
}) {
  let homeComponent;
  if (authToken) {
    homeComponent = shouldRenderSettings ? <SettingsComponent onBack={toggleRenderSettingsFlag} t={t} />
      : (
        <div id="overlay">
          <Header IS_LOCALHOST={IS_LOCALHOST} loading={loadingReport} />
          <Tabs t={t}>
            {(reportArray && reportArray.length !== 0)
              && <FileHistoryContainer loading={loadingReport} />}
            {(!reportArray || !reportArray.length) && <Placeholder loading={loadingReport} />}
          </Tabs>
        </div>
      );
  } else {
    homeComponent = (
      <Spin spinning={loading}>
        {IS_LOCALHOST && <Authenticate />}
      </Spin>
    );
  }
  return (
    <div id="content">
      <Notifications />
      {homeComponent}
      {!popupOpen && <InternetConnectionError />}
      <HomeDialog show={popupOpen} text={t('A MicroStrategy for Office Add-in dialog is open')} />
    </div>
  );
}

HomeContent.propTypes = {
  loading: PropTypes.bool,
  popupOpen: PropTypes.bool,
  loadingReport: PropTypes.bool,
  t: PropTypes.func,
  toggleRenderSettingsFlag: PropTypes.func,
  authToken: PropTypes.string,
  shouldRenderSettings: PropTypes.bool,
  reportArray: PropTypes.arrayOf(PropTypes.shape({ length: PropTypes.number, })),
};
