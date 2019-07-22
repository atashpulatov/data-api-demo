import React, {Component} from 'react';
import {sessionHelper} from '../storage/session-helper';
import {Button, Popover} from 'antd';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {toggleSecuredFlag, toggleIsConfirmFlag} from '../office/office-actions';
import {MSTRIcon} from 'mstr-react-library';
import mstrLogo from './assets/mstr_logo.png';
import {SettingsMenu} from './settings-menu';
import {Confirmation} from './confirmation';

export class _Header extends Component {
  constructor() {
    super();
    this.state = {isSettings: false};
  }

  componentDidMount = async () => {
    sessionHelper.getUserInfo();
    document.addEventListener('click', this.closeOnClick);
    document.addEventListener('keyup', this.closeOnTab);
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.closeOnClick);
    document.removeEventListener('keyup', this.closeOnTab);
  }

  toggleSettings = () => {
    return this.setState({...this.state, isSettings: !this.state.isSettings});
  }

  closeOnTab = (e) => {
    if (e.keyCode === 27 && this.state.isSettings) {
      this.setState({...this.state, isSettings: false});
    }
  };

  closeOnClick = (e) => {
    if (this.state.isSettings && !e.target.classList.contains('no-trigger-close')) {
      this.setState({...this.state, isSettings: false});
    }
  };

  render() {
    const {loading, t, isConfirm} = this.props;
    return (
      <header id='app-header'>
        <div className="mstr-logo">
          <span id='profileImage'>
            {/* TODO: Alt text for logo will be added later */}
            <img src={mstrLogo} />
          </span>
        </div>
        <div className="header-buttons">
          <Popover placement="bottom" content={t('More Items')} mouseEnterDelay={1}>
            <Button className="settings-btn no-trigger-close" onClick={this.toggleSettings} disabled={loading}>
              <MSTRIcon type="settings" />
            </Button>
          </Popover>
          {this.state.isSettings && <SettingsMenu />}
          {isConfirm && <Confirmation />}
        </div>
      </header >
    );
  };
}

_Header.defaultProps = {
  t: (text) => text,
};

function mapStateToProps(state) {
  const {userFullName, userInitials, envUrl, authToken} = state.sessionReducer;
  const {reportArray, isSecured, isConfirm} = state.officeReducer;
  return {userFullName, userInitials, envUrl, authToken, reportArray, isSecured, isConfirm};
};

const mapDispatchToProps = {
  toggleSecuredFlag,
  toggleIsConfirmFlag,
};

export const Header = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Header));

