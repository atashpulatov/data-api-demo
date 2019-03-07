import React from 'react';
import {Header} from './header.jsx';
import {FileHistoryContainer} from '../file-history/file-history-container.jsx';
import {Spin, Tabs} from 'antd';
import {Notifications} from '../notification/notifications.jsx';
import {Authenticate} from '../authentication/auth-component.jsx';
import {Placeholder} from './placeholder.jsx';

const TabPane = Tabs.TabPane;

class PageBuilder {
  getPage = (loading, authToken, reportArray) => {
    return (
      <div id='content'>
        <Notifications />
        {(authToken && <Header />)}
        {/* Logout button will be moved next to the username in the header */}
        <Tabs defaultActiveKey="data" className="tabs-container">
          {/* <TabPane tab="Environment" key="environment">
            <div>TODO</div>
          </TabPane> */}
          <TabPane tab="Imported Data" key="data">
            {(reportArray && reportArray.length !== 0) && authToken && <FileHistoryContainer />}
            {(!reportArray || !reportArray.length) && authToken && <Placeholder />}
            <Spin spinning={loading}>
              {!authToken && <Authenticate />}
            </Spin>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export const pageBuilder = new PageBuilder();
