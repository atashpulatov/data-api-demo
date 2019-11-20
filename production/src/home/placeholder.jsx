import React from 'react';
import { Button } from 'antd';
import { withTranslation } from 'react-i18next';
import { sessionHelper } from '../storage/session-helper';
import { fileHistoryContainerHOC } from '../file-history/file-history-container-HOC';
import { ReactComponent as FolderArt } from './assets/folder-art.svg';

export const _Placeholder = ({ loading, t, addDataAction }) => {
  sessionHelper.disableLoading();
  return (
    <div className='get-started-container'>
      <FolderArt aria-label={t('Office Add-in logo')} />
      <h2>{t('Let\'s get started')}</h2>
      <p>{t('You haven\'t imported any reports or datasets yet. Import data to start!')}</p>
      <Button id='import-data-placeholder' type='primary' onClick={() => addDataAction()} disabled={loading}>{t('Import Data')}</Button>
    </div>
  );
};

export const Placeholder = fileHistoryContainerHOC(withTranslation('common')(_Placeholder));
