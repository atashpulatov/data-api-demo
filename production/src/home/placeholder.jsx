import React from 'react';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import folderArt from './assets/folder-art.svg';
import {fileHistoryContainerHOC} from '../file-history/file-history-container-HOC';

export class _Placeholder extends React.Component {
  render() {
    sessionHelper.disableLoading();
    return (
      <div className='get-started-container'>
        <img width='189px' height='108px' src={folderArt} alt='Office Add-in logo' />
        <h2>Let's get started</h2>
        <p>You haven’t imported any report or dataset yet. Let’s import data to start!</p>
        <Button id='import-data-placeholder' type='primary' onClick={() => this.props.addDataAction()} disabled={this.props.loading}>Import Data</Button>
      </div>
    );
  }
};
export const Placeholder = fileHistoryContainerHOC(_Placeholder);
