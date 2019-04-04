import React from 'react';
import {Header} from './header.jsx';
import {FileHistoryContainer} from '../file-history/file-history-container.jsx';
import {Spin, Tabs} from 'antd';
import {Notifications} from '../notification/notifications.jsx';
import {Authenticate} from '../authentication/auth-component.jsx';
import {Placeholder} from './placeholder.jsx';
import {HomeDialog} from './home-dialog';

const TabPane = Tabs.TabPane;
const URL = `${window.location.href}`;
const IS_LOCALHOST = URL.includes('localhost');

class PageBuilder {
  getPage = (loading, loadingReport, authToken, reportArray, popupOpen) => {
    return (
      <div id='content'>
        <Notifications />
        {
          authToken ?
            <div>
              <Header IS_LOCALHOST={IS_LOCALHOST} loading={loadingReport} />
              <Tabs defaultActiveKey="data" className="tabs-container">
                <TabPane tab="Imported Data" key="data">
                  {(reportArray && reportArray.length !== 0) && <FileHistoryContainer loading={loadingReport} />}
                  {(!reportArray || !reportArray.length) && <Placeholder loading={loadingReport} />}
                </TabPane>
              </Tabs>
            </div> :
            < Spin spinning={loading}>
              {IS_LOCALHOST && <Authenticate />}
            </Spin>
        }
        <HomeDialog show={popupOpen} text='A MicroStrategy for Office Add&#8209;in dialog is open.' />
      </div >
    );
  }
}

export const pageBuilder = new PageBuilder();
