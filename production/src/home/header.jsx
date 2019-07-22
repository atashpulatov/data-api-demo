import React, {Component} from 'react';
import {sessionHelper} from '../storage/session-helper';
import {Button, Popover} from 'antd';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {toggleSecuredFlag, toggleIsSettingsFlag, toggleIsConfirmFlag} from '../office/office-actions';
import {MSTRIcon} from 'mstr-react-library';
import mstrLogo from './assets/mstr_logo.png';
import {SettingsMenu} from './settings-menu';
import {Confirmation} from './confirmation';

export class _Header extends Component {
  componentDidMount = async () => {
    sessionHelper.getUserInfo();
    this.addCloseSettingsListeners();
  }

  componentWillUnmount = () => {
    this.removeCloseSettingsListeners();
  }

  shouldComponentUpdate = (nextProps) => {
    if (nextProps.isConfirm && !this.props.isConfirm) {
      this.removeCloseSettingsListeners();
    }
    if (!nextProps.isConfirm && this.props.isConfirm) {
      this.addCloseSettingsListeners();
    }
    return true;
  }

  addCloseSettingsListeners = () => {
    document.addEventListener('click', this.closeOnClick);
    document.addEventListener('keyup', this.closeOnTab);
  }

  removeCloseSettingsListeners = () => {
    document.removeEventListener('click', this.closeOnClick);
    document.removeEventListener('keyup', this.closeOnTab);
  }

  toggleSettings = () => {
    this.props.toggleIsSettingsFlag(!this.props.isSettings);
  }

  closeOnTab = (e) => {
    if (e.keyCode === 27 && this.props.isSettings) {
      this.props.toggleIsSettingsFlag(false);
    }
  };

  closeOnClick = (e) => {
    if (this.props.isSettings && !e.target.classList.contains('no-trigger-close')) {
      this.props.toggleIsSettingsFlag(false);
    }
  };

  render() {
    const {loading, t, isSettings, isConfirm} = this.props;
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
          {isSettings && <SettingsMenu />}
          {isConfirm && <Confirmation />}
        </div>
      </header >
    );
  };
}

_Header.defaultProps = {
  t: (text) => text,
};

function mapStateToProps({officeReducer}) {
  const {isSettings, isConfirm} = officeReducer;
  return {isSettings, isConfirm};
};

const mapDispatchToProps = {
  toggleSecuredFlag,
  toggleIsSettingsFlag,
  toggleIsConfirmFlag,
};

export const Header = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Header));

