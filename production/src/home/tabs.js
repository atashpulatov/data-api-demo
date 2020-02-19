import React from 'react';
import PropTypes from 'prop-types';

export const Tabs = ({ t, children }) => (
  <div className="tabs">
    <div className="tab-container">
      <nav className="tabs-nav">
        <div className="tab-header">{t('Imported Data')}</div>
      </nav>
    </div>
    <section className="tab-content">
      <div className="tabpane">
        {children}
      </div>
    </section>
  </div>
);

Tabs.propTypes = {
  t: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
};
