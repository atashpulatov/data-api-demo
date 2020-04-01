import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import './settings.css';


export default function SettingsComponent({ onBack, t }) {
  return (
    <>
      <div className="settings-bar">
        <div className="back-wrapper" role="button" onClick={onBack} onKeyPress={onBack} tabIndex="0" aria-label="Back"><Icon type="left" /></div>
        <div>{t('Settings')}</div>
      </div>
    </>
  );
}
SettingsComponent.propTypes = {
  onBack: PropTypes.func,
  t: PropTypes.func
};
