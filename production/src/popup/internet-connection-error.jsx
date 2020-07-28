import React, { useState, useEffect } from 'react';
import './internet-connection.scss';
import { ConnectionError } from '@mstr/connector-components';

const InternetConnectionError = () => {
  const [status, setStatus] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleConnectionChange = () => (window.navigator.onLine ? setStatus(true) : setStatus(false));
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    return (() => window.removeEventListener('online', handleConnectionChange),
    () => window.removeEventListener('offline', handleConnectionChange));
  }, [status]);

  return status
    ? null
    : (
      <div className="internet-connection-container">
        <ConnectionError />
      </div>
    );
};

export default InternetConnectionError;
