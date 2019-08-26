import React from 'react';
import {Header} from './header.jsx';
import {FileHistoryContainer} from '../file-history/file-history-container.jsx';
import {Spin} from 'antd';
import {Notifications} from '../notification/notifications.jsx';
import {Authenticate} from '../authentication/auth-component.jsx';
import {Placeholder} from './placeholder.jsx';
import {HomeDialog} from './home-dialog';
import {Tabs} from './tabs';
import {SettingsComponent} from '../settings/settings-component.jsx';

const URL = `${window.location.href}`;
const IS_LOCALHOST = URL.includes('localhost');

class PageBuilder {
  getPage = ((loading, loadingReport, authToken, reportArray, popupOpen, t, shouldRenderSettings) => {
    return (
      <div id='content'>
        <Notifications />
        {
          authToken ?
            shouldRenderSettings ? <SettingsComponent />
              :
              <div id='overlay'>
                <Header IS_LOCALHOST={IS_LOCALHOST} loading={loadingReport} />
                <Tabs t={t}>
                  {(reportArray && reportArray.length !== 0) && <FileHistoryContainer
                    loading={loadingReport}
                  />}
                  {(!reportArray || !reportArray.length) && <Placeholder loading={loadingReport} />}
                </Tabs>
              </div> :
            < Spin spinning={loading}>
              {IS_LOCALHOST && <Authenticate />}
            </Spin>
        }
        <HomeDialog show={popupOpen} text={t('A MicroStrategy for Office Add-in dialog is open')} />
      </div >
    );
  });
}

export const pageBuilder = new PageBuilder();
