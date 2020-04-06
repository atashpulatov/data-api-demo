import React, { Component } from 'react';
import { Button, Popover } from 'antd';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { MSTRIcon, LoadingText } from '@mstr/mstr-react-library';
import PropTypes from 'prop-types';
import { toggleIsSettingsFlag as toggleIsSettingsFlagImported, toggleIsConfirmFlag as toggleIsConfirmFlagImported } from '../redux-reducer/office-reducer/office-actions';
import { sessionHelper } from '../storage/session-helper';
import mstrLogo from './assets/mstr_logo.png';
import { SettingsMenu } from './settings-menu';
import { Confirmation } from './confirmation';

export class HeaderNotConnected extends Component {
  componentDidMount = () => {
    sessionHelper.getUserInfo();
    sessionHelper.getUserAttributeFormPrivilege();
    this.addCloseSettingsListeners();
  }

  componentWillUnmount = () => {
    this.removeCloseSettingsListeners();
  }

  shouldComponentUpdate = (nextProps) => {
    const { isConfirm } = this.props;
    if (nextProps.isConfirm && !isConfirm) {
      this.removeCloseSettingsListeners();
      this.addCloseConfirmationListener();
    }
    if (!nextProps.isConfirm && isConfirm) {
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
    const { isSettings, toggleIsSettingsFlag } = this.props;
    toggleIsSettingsFlag(!isSettings);
  }

  closeSettingsOnEsc = (e) => {
    const { isSettings, toggleIsSettingsFlag } = this.props;
    if (e.keyCode === 27 && isSettings) {
      toggleIsSettingsFlag(false);
    }
  };

  closeSettingsOnClick = (e) => {
    const { isSettings, toggleIsSettingsFlag } = this.props;
    if (isSettings && !e.target.classList.contains('no-trigger-close')) {
      toggleIsSettingsFlag(false);
    }
  };

  closeConfirmationOnEsc = (e) => {
    const { isConfirm, toggleIsConfirmFlag } = this.props;
    if (e.keyCode === 27 && isConfirm) {
      toggleIsConfirmFlag(false);
    }
  }

  render() {
    const {
      loading, t, isSettings, isConfirm, isClearing
    } = this.props;
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
              <img
                src={mstrLogo}
                alt="microstrategy logo"
              />
            </span>
          </div>
          <div className="header-buttons">
            <Popover placement="bottom" content={t('More Items')} mouseEnterDelay={1}>
              <Button id="settings-button" className="settings-btn no-trigger-close" onClick={this.toggleSettings} disabled={loading}>
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

HeaderNotConnected.defaultProps = { t: (text) => text };

function mapStateToProps({ officeReducer }) {
  const { isSettings, isConfirm, isClearing } = officeReducer;
  return { isSettings, isConfirm, isClearing };
}

const mapDispatchToProps = {
  toggleIsSettingsFlag: toggleIsSettingsFlagImported,
  toggleIsConfirmFlag: toggleIsConfirmFlagImported,
};

HeaderNotConnected.propTypes = {
  loading: PropTypes.bool,
  isConfirm: PropTypes.bool,
  isSettings: PropTypes.bool,
  isClearing: PropTypes.bool,
  toggleIsSettingsFlag: PropTypes.func,
  toggleIsConfirmFlag: PropTypes.func,
  t: PropTypes.func
};
const Header = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(HeaderNotConnected));
export default Header;
