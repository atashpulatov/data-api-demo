import React from 'react';

export const Tabs = ({ t, children }) => (
  <div className='tabs'>
    <div className='tab-container'>
      <nav className='tabs-nav'>
        <div className='tab-header'>{t('Imported Data')}</div>
      </nav>
    </div>
    <section className='tab-content'>
      <div className='tabpane'>
        {children}
      </div>
    </section>
  </div>
);
