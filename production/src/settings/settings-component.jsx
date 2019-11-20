import React from 'react';
import { Icon } from 'antd';

import './settings.css';


export default function SettingsComponent({ onBack, t }) {
  return (
    <>
      <div className="settings-bar">
        <div className="back-wrapper" role="button" onClick={onBack} tabIndex="0" aria-label="Back"><Icon type="left" /></div>
        <div>{t('Settings')}</div>
      </div>
    </>
  );
}
