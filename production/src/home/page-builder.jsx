import React from 'react';
import { Spin } from 'antd';
import Header from './header';
import { FileHistoryContainer } from '../file-history/file-history-container';
import { Notifications } from '../notification/notifications';
import { Authenticate } from '../authentication/auth-component';
import { Placeholder } from './placeholder';
import { HomeDialog } from './home-dialog';
import { Tabs } from './tabs';
import { SettingsComponent } from '../settings/settings-component';


const URL = `${window.location.href}`;
const IS_LOCALHOST = URL.includes('localhost');

export default function HomeContent({
  loading, loadingReport, authToken, reportArray, popupOpen, shouldRenderSettings, t,
}) {
  let homeComponent;
  if (authToken) {
    homeComponent = shouldRenderSettings ? <SettingsComponent />
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
      <HomeDialog show={popupOpen} text={t('A MicroStrategy for Office Add-in dialog is open')} />
    </div>
  );
}
