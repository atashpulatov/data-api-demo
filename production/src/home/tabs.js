import React from 'react';

export const Tabs = ({t, children}) => {
  return (
    <div className="tabs">
      <div className="tab-container">
        <div className="tabs-nav">
          <div className="tab-header">{t('Imported Data')}</div>
          <div className="tab-line"></div>
        </div>
      </div>
      <div className="tab-content">
        <div className="tabpane">
          {children}
        </div>
      </div>
    </div>
  );
};
