import React from 'react';
import {Header} from './header.jsx';
import {FileHistoryContainer} from '../file-history/file-history-container.jsx';
import {Spin} from 'antd';
import {Notifications} from '../notification/notifications.jsx';
import {Authenticate} from '../authentication/auth-component.jsx';
import {Placeholder} from './placeholder.jsx';

class PageBuilder {
  getPage = (loading, authToken, reportArray) => {
    console.log('getting page');
    return (
      <div id='content'>
        <Notifications />
        <Header authToken={authToken} />
        {/* Logout button will be moved next to the username in the header */}
        {(reportArray && reportArray.length) && authToken && <FileHistoryContainer />}
        {(!reportArray || !reportArray.length) && authToken && <Placeholder />}
        <Spin spinning={loading}>
          {!authToken && <Authenticate />}
        </Spin>
      </div>
    );
  }
}

export const pageBuilder = new PageBuilder();
