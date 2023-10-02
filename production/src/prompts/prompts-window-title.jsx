import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Empty } from '@mstr/connector-components/';
import i18n from '../i18n';

/**
 * This component is used to display the title of the prompts window when the user has triggered
 * multiple object re-prompting. It shows the current object being re-prompted and the total number of objects
 * in the list. It also shows a loading indicator when processing the re-prompting takes a long time.
 * @param {*} param0
 * @returns
 */
export const PromptsWindowTitle = ({
  showLoading, showTitle, index, total, objectName,
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

PromptsWindowTitle.defaultProps = {
  showLoading: true,
  showTitle: false,
  index: 0,
  total: 0,
  objectName: '',
};
