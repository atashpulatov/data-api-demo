import React from 'react';
import PropTypes from 'prop-types';

import './settings.css';
import { ContextMenuIcon } from '@mstr/mstr-icons';

export default function SettingsComponent({ onBack, t }) {
  return (
    <>
      <div className="settings-bar">
        <div className="back-wrapper" role="button" onClick={onBack} onKeyPress={onBack} tabIndex="0" aria-label="Back"><ContextMenuIcon /></div>
        <div>{t('Settings')}</div>
      </div>
    </>
  );
}
SettingsComponent.propTypes = {
  onBack: PropTypes.func,
  t: PropTypes.func
};
