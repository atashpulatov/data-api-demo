import React, { FC } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { ObjectWindowTitleTypes } from './object-window-title-types';

/**
 * This component is used to display the title of the popup window when the user has triggered
 * object import, edit, or re-prompt. It shows the current object being operated on and, for multiple re-prompt,
 * the total number of objects in the list.
 * @returns string customized text for the popup window title (e.g. Report/Dossier workflows)
 */
export const ObjectWindowTitleNotConnected: FC<ObjectWindowTitleTypes> = ({
  objectType, objectName, isReprompt, isEdit, index, total
}) => {
  const [t] = useTranslation('common', { i18n });
  // Capitalize first letter of object type to match the i18n key for title strings
  const capitalizedObjectType = objectType.charAt(0).toUpperCase() + objectType.slice(1);

  const showMultipleRepromptMessage = isReprompt && !isEdit && total > 1;
  const showSingleRepromptMessage = isReprompt && !isEdit && total === 1;

  let promptTitle = `${t(`Import ${capitalizedObjectType}`)} > ${objectName}`;

  if (isEdit) {
    promptTitle = `${t(`Edit ${capitalizedObjectType}`)} > ${objectName}`;
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

export const ObjectWindowTitle = connect(mapStateToProps)(ObjectWindowTitleNotConnected);
