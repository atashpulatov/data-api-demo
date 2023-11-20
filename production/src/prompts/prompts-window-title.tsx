import React, { FC } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PromptWindowTitleTypes } from './prompts-window-title-types';

import i18n from '../i18n';

/**
 * This component is used to display the title of the prompts window when the user has triggered
 * multiple object re-prompting. It shows the current object being re-prompted and the total number of objects
 * in the list. It also shows a loading indicator when processing the re-prompting takes a long time.
 * @param {*} props component properties passed in.
 * @returns
 */
const PromptsWindowTitleNotConnected: FC<PromptWindowTitleTypes> = ({
  isReprompt, isEdit, index, total, objectName
}) => {
  const [t] = useTranslation('common', { i18n });

  const showMultipleRepromptMessage = isReprompt && !isEdit && total > 1;
  const showSingleRepromptMessage = isReprompt && !isEdit && total === 1;

  let promptTitle = `${t('Import Report')} > ${objectName}`;

  if (isEdit) {
    promptTitle = `${t('Edit Report')} > ${objectName}`;
  } else if (showMultipleRepromptMessage) {
    promptTitle = `${t('Reprompt')} ${t('{{index}} of {{total}}', { index, total })} > ${objectName}`;
  } else if (showSingleRepromptMessage) {
    promptTitle = `${t('Reprompt')} > ${objectName}`;
  }

  return (
    <div className="title-bar">
      <span>{promptTitle}</span>
    </div>
  );
};

const mapStateToProps = (state: {
  repromptsQueueReducer: {
    index: number;
    total: number;
  }
}) => {
  const { repromptsQueueReducer } = state;

  return {
    index: repromptsQueueReducer.index,
    total: repromptsQueueReducer.total,
  };
};

export const PromptsWindowTitle = connect(mapStateToProps)(PromptsWindowTitleNotConnected);
