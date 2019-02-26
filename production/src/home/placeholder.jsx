import React from 'react';
import {sessionHelper} from '../storage/session-helper';
import {Button, Tabs} from 'antd';
import {popupController} from '../popup/popup-controller';
import folderArt from './assets/folder-art.svg';

const TabPane = Tabs.TabPane;

export const Placeholder = () => {
  sessionHelper.disableLoading();
  return (
    <Tabs defaultActiveKey="data" className="tabs-container">
      <TabPane tab="Environment" key="environment">
        <div>TODO</div>
      </TabPane>
      <TabPane tab="Imported Data" key="data">
        <div className='get-started-container'>
          <img width='189px' height='108px' src={folderArt} alt='Office Add-in logo' />
          <h2>Let's get started</h2>
          <p>You haven’t imported any report/dataset yet. Let’s import data to start!</p>
          <Button type='primary' onClick={popupController.runPopupNavigation}>Import data</Button>
        </div>
      </TabPane>
    </Tabs>
  );
};
