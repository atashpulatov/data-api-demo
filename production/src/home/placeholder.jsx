import React from 'react';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import {popupController} from '../popup/popup-controller';
import folderArt from './assets/folder-art.svg';

export class Placeholder extends React.Component {
  constructor() {
    super();
    this.state = {
      allowAddDataClick: true,
    };
  }
  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }
  addDataAction = () => {
    this.setState({allowAddDataClick: false}, async () => {
      await popupController.runPopupNavigation();
      this._ismounted && this.setState({allowAddDataClick: true});
    });
  }
  render() {
    sessionHelper.disableLoading();
    return (
      <div className='get-started-container'>
        <img width='189px' height='108px' src={folderArt} alt='Office Add-in logo' />
        <h2>Let's get started</h2>
        <p>You haven’t imported any report or dataset yet. Let’s import data to start!</p>
        <Button id='import-data-placeholder' type='primary' onClick={() => this.state.allowAddDataClick && this.addDataAction()} disabled={this.props.loading}>Import Data</Button>
      </div>
    );
  }
};
