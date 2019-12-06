import React, { useState, useEffect } from 'react';
import './internet-connection.scss';
import { Icon } from 'antd';
import { withTranslation } from 'react-i18next';

const InternetConnectionError = ({ t }) => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const handleConnectionChange = () => (window.navigator.onLine ? setStatus(true) : setStatus(false));
    handleConnectionChange();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    return (() => window.removeEventListener('online', handleConnectionChange),
    () => window.removeEventListener('offline', handleConnectionChange));
  }, [status]);

  const renderOfflineMessage = () => (status ? null : (
    <div className="overlay">
      <div className="dialog">
        <div className="row">
          <div className="column icon">
            <Icon type="warning" theme="filled" style={{ color: '#faad14', fontSize:'18px' }} />
          </div>
          <div className="column infoText">
            <div className="row" style={{ fontWeight:500 }}>
              {t('The internet connection appears to be offline.')}
            </div>
            <div className="row">
              {t('Please check your internet connection.')}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="loading-container">
            <img style={{ width:'1.8em', height:'1.8em' }} src="./assets/small_loading.gif" alt="Loading icon" />
            <span>{t('Trying to connect...')}</span>
          </div>
        </div>
      </div>
    </div>
  ));

  return renderOfflineMessage();
};

export default withTranslation('common')(InternetConnectionError);
