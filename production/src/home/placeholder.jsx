import React from 'react';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import {popupController} from '../popup/popup-controller';
import folderArt from './assets/folder-art.svg';
import {withTranslation} from 'react-i18next';

export const _Placeholder = ({loading, t}) => {
  sessionHelper.disableLoading();
  return (
    <div className='get-started-container'>
      <img width='189px' height='108px' src={folderArt} alt={t('Office Add-in logo')} />
      <h2>{t('Let\'s get started')}</h2>
      <p>{t('You haven\'t imported any report or dataset yet. Let\'s import data to start!')}</p>
      <Button id='import-data-placeholder' type='primary' onClick={popupController.runPopupNavigation} disabled={loading}>{t('Import Data')}</Button>
    </div>
  );
};

export const Placeholder = withTranslation('common')(_Placeholder);
