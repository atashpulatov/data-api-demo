import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Empty } from '@mstr/connector-components';

import i18n from '../i18n';

/**
 * This component is used to display the title of the prompts window when the user has triggered
 * multiple object re-prompting. It shows the current object being re-prompted and the total number of objects
 * in the list. It also shows a loading indicator when processing the re-prompting takes a long time.
 * @param {*} param0
 * @returns
 */
const PromptsWindowTitleNotConnected = (props) => {
  const [t] = useTranslation('common', { i18n });
  const {
    showLoading, showTitle, index, total, objectName,
  } = props;

  return (
    <>
      {showTitle && <h3 className="dialog-header-title">{t('Reprompt')} {index}/{total} &gt; {objectName} </h3>}
      {showLoading && <div style={{ height: showTitle ? '85vh' : '100vh' }}><Empty isLoading /></div>}
    </>
  );
};

PromptsWindowTitleNotConnected.propTypes = {
  showLoading: PropTypes.bool,
  showTitle: PropTypes.bool,
  index: PropTypes.number,
  total: PropTypes.number,
  objectName: PropTypes.string,
};

PromptsWindowTitleNotConnected.defaultProps = {
  showLoading: true,
  showTitle: false,
  index: 0,
  total: 0,
  objectName: '',
};

const mapStateToProps = (state) => {
  const { repromptsQueueReducer } = state;

  return {
    index: repromptsQueueReducer.index,
    total: repromptsQueueReducer.total,
  };
};

export const PromptsWindowTitle = connect(mapStateToProps)(PromptsWindowTitleNotConnected);
