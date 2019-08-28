import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Icon } from 'antd';

import { toggleIsSettingsFlag, toggleRenderSettingsFlag } from '../office/office-actions';
import './settings.css';


export class _SettingsComponent extends Component {
  closeSettingsComponent = () => {
    const {
      isSettings, shouldRenderSettings,
    } = this.props;
    toggleIsSettingsFlag(!isSettings);
    toggleRenderSettingsFlag(!shouldRenderSettings);
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <div className="settings-bar">
          <div className="back-wrapper" role="button" onClick={this.closeSettingsComponent} tabIndex="0" aria-label="Back"><Icon type="left" /></div>
          <div>{t('Settings')}</div>
        </div>
      </div>
    );
  }
}

_SettingsComponent.defaultProps = {
  t: (text) => text,
};

function mapStateToProps({ officeReducer }) {
  const { isSettings, shouldRenderSettings } = officeReducer;
  return { isSettings, shouldRenderSettings };
}

const mapDispatchToProps = {
  toggleIsSettingsFlag,
  toggleRenderSettingsFlag,
};

export const SettingsComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_SettingsComponent));
