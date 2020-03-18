import React from 'react';
import { Button } from 'antd';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { sessionHelper } from '../storage/session-helper';
import { fileHistoryContainerHOC } from '../file-history/file-history-container-HOC';
import { ReactComponent as FolderArt } from './assets/folder-art.svg';
import { officeStoreService } from '../office/store/office-store-service';

export const PlaceHolderNotConnected = ({ loading, t, addDataAction }) => {
  sessionHelper.disableLoading();
  return (
    <div className="get-started-container">
      <FolderArt aria-label={t('Office Add-in logo')} />
      <h2>{t('Let\'s get started')}</h2>
      <p>{t('You haven\'t imported any reports or datasets yet. Import data to start!')}</p>
      <Button id="import-data-placeholder" type="primary" onClick={() => addDataAction()} disabled={loading}>{t('Import Data')}</Button>
      {sessionHelper.isDevelopment() && <div style={{ marginTop: '5px' }}><Button type="primary" onClick={() => sessionHelper.importSeasonalReport()} disabled={loading}>Seasonal report</Button></div>}
      {sessionHelper.isDevelopment() && (
        <div style={{ marginTop: '5px' }}>
          <Button
            className="add-data-btn floating-button"
            onClick={() => officeStoreService.clearObjectReducerFromSettings()}
            disabled={loading}
          >
            Clear Reducer
          </Button></div>
      )}
    </div>
  );
};
PlaceHolderNotConnected.propTypes = {
  loading: PropTypes.bool,
  addDataAction: PropTypes.func,
  t: PropTypes.func
};

export const Placeholder = fileHistoryContainerHOC(withTranslation('common')(PlaceHolderNotConnected));
