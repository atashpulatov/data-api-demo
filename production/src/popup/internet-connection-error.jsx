import React, { useState, useEffect } from 'react';
import './internet-connection.scss';
import { Icon } from 'antd';
import { withTranslation } from 'react-i18next';
import loadingAnimation from './assets/loading-animation';

const InternetConnectionError = ({ t }) => {
  const [status, setStatus] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleConnectionChange = () => (window.navigator.onLine ? setStatus(true) : setStatus(false));
    handleConnectionChange();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    return (() => window.removeEventListener('online', handleConnectionChange),
    () => window.removeEventListener('offline', handleConnectionChange));
  }, [status]);

  const renderOfflineMessage = () => (status ? null : (
    <div className="internet-connection-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-describedby="description"
        aria-labelledby="title"
        className="internet-connection-dialog">
        <div className="internet-connection-row">
          <div className="internet-connection-column internet-connection-icon">
            <Icon type="warning" theme="filled" style={{ color: '#faad14', fontSize: '18px' }} />
          </div>
          <div className="internet-connection-column internet-connection-infoText">
            <div id="title" className="internet-connection-row" style={{ fontWeight: 500 }}>
              {t('The internet connection appears to be offline.')}
            </div>
            <div id="description" className="internet-connection-row">
              {t('Please check your internet connection.')}
            </div>
          </div>
        </div>
        <div className="internet-connection-row">
          <div className="internet-connection-loading-container">
            <img style={{ width: '1.8em', height: '1.8em' }} src={loadingAnimation} alt="Loading icon" />
            <span>{t('Trying to connect...')}</span>
          </div>
        </div>
      </div>
    </div>
  ));

  return renderOfflineMessage();
};

export default withTranslation('common')(InternetConnectionError);
