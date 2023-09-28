import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Empty } from '@mstr/connector-components/';
import i18n from '../i18n';

export const PromptsWindowTitle = ({
  showLoading = true, showTitle = false, index = 0, total = 0, objectName = ''
}) => {
  const [t] = useTranslation('common', { i18n });

  return (
    <>
      {showTitle && <h3 className="dialog-header-title">{t('Reprompt')} {index}/{total} &gt; {objectName} </h3>}
      {showLoading && <div style={{ height: showTitle ? '85vh' : '100vh' }}><Empty isLoading /></div>}
    </>
  );
};

PromptsWindowTitle.propTypes = {
  showLoading: PropTypes.bool,
  showTitle: PropTypes.bool,
  index: PropTypes.number,
  total: PropTypes.number,
  objectName: PropTypes.string,
};
