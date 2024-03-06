import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContextMenuIcon } from '@mstr/mstr-icons';

import PropTypes from 'prop-types';

import './settings.css';

const SettingsComponent = ({ onBack }) => {
  const { t } = useTranslation();
  return (
    <div className='settings-bar'>
      <div
        className='back-wrapper'
        role='button'
        onClick={onBack}
        onKeyPress={onBack}
        tabIndex='0'
        aria-label='Back'
      >
        <ContextMenuIcon />
      </div>
      <div>{t('Settings')}</div>
    </div>
  );
};

SettingsComponent.propTypes = {
  onBack: PropTypes.func,
};

export default SettingsComponent;
