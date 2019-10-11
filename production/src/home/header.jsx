import React, { Component } from 'react';
import { Button, Popover } from 'antd';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { MSTRIcon, LoadingText } from '@mstr/mstr-react-library';
import { toggleIsSettingsFlag, toggleIsConfirmFlag } from '../office/office-actions';
import { sessionHelper } from '../storage/session-helper';
import mstrLogo from './assets/mstr_logo.png';
import { SettingsMenu } from './settings-menu';
import { Confirmation } from './confirmation';


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
      this.addCloseConfirmationListener();
    }
    if (!nextProps.isConfirm && this.props.isConfirm) {
      this.addCloseSettingsListeners();
      this.removeCloseConfirmationListener();
    }
    return true;
  }

  addCloseSettingsListeners = () => {
    document.addEventListener('click', this.closeSettingsOnClick);
    document.addEventListener('keyup', this.closeSettingsOnEsc);
  }

  removeCloseSettingsListeners = () => {
    document.removeEventListener('click', this.closeSettingsOnClick);
    document.removeEventListener('keyup', this.closeSettingsOnEsc);
  }

  addCloseConfirmationListener = () => {
    document.addEventListener('keyup', this.closeConfirmationOnEsc);
  }

  removeCloseConfirmationListener = () => {
    document.removeEventListener('keyup', this.closeConfirmationOnEsc);
  }

  toggleSettings = () => {
    this.props.toggleIsSettingsFlag(!this.props.isSettings);
  }

  closeSettingsOnEsc = (e) => {
    if (e.keyCode === 27 && this.props.isSettings) {
      this.props.toggleIsSettingsFlag(false);
    }
  };

  closeSettingsOnClick = (e) => {
    if (this.props.isSettings && !e.target.classList.contains('no-trigger-close')) {
      this.props.toggleIsSettingsFlag(false);
    }
  };

  closeConfirmationOnEsc = (e) => {
    if (e.keyCode === 27 && this.props.isConfirm) {
      this.props.toggleIsConfirmFlag(false);
    }
  }

  render() {
    const { loading, t, isSettings, isConfirm, isClearing } = this.props;
    return (
      <>
        {isClearing
          && (
            <div className="block-all-ui">
              <LoadingText text={t('Clearing data')} />
            </div>
          )}
        <header id="app-header">
          <div className="mstr-logo">
            <span id="profileImage">
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
        </header>
      </>

    );
  }
}

_Header.defaultProps = { t: (text) => text };

function mapStateToProps({ officeReducer }) {
  const { isSettings, isConfirm, isClearing } = officeReducer;
  return { isSettings, isConfirm, isClearing };
}

const mapDispatchToProps = {
  toggleIsSettingsFlag,
  toggleIsConfirmFlag,
};

const Header = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Header));
export default Header;
