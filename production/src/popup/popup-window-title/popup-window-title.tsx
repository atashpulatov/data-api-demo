import React, { FC } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PromptWindowTitleTypes } from './prompts-window-title-types';

import i18n from '../i18n';

/**
 * This component is used to display the title of the popup window when the user has triggered
 * object import, edit, or re-prompt. It shows the current object being operated on and, for multiple re-prompt,
 * the total number of objects in the list.
 * @param {PromptWindowTitleTypes} props component properties passed in.
 * @returns
 */
const PopupWindowTitle: FC<PromptWindowTitleTypes> = ({
  isReprompt, isEdit, index, total, objectName
}: PromptWindowTitleTypes) => {
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
