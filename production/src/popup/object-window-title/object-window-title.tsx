import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { ObjectWindowTitleTypes } from './object-window-title-types';

import './object-window-title.scss';

/**
 * This component is used to display the title of the popup window when the user has triggered
 * object import, edit, or re-prompt. It shows the current object being operated on and, for multiple re-prompt,
 * the total number of objects in the list.
 * @returns container with customized text for the popup window title (e.g. Report/Dossier workflows)
 */
export const ObjectWindowTitle: FC<ObjectWindowTitleTypes> = ({
  objectType, objectName, isReprompt, isEdit, index, total
}) => {
  const [t] = useTranslation('common', { i18n });
  // Capitalize first letter of object type to match the i18n key for title strings
  const capitalizedObjectType = objectType.charAt(0).toUpperCase() + objectType.slice(1);

  const isSingleReprompt = isReprompt && total === 1;
  const isMultipleReprompt = isReprompt && total > 1;

  const importString = t(`Import ${capitalizedObjectType}`);
  let windowTitle = `${importString} > ${objectName}`;

  if (isEdit) {
    const editString = t(`Edit ${capitalizedObjectType}`);
    windowTitle = `${editString} > ${objectName}`;
  } else if (isSingleReprompt) {
    windowTitle = `${t('Reprompt')} > ${objectName}`;
  } else if (isMultipleReprompt) {
    windowTitle = `${t('Reprompt')} ${t('{{index}} of {{total}}', { index, total })} > ${objectName}`;
  }

  return (
    <div className="object-window-title-bar">
      <span className="title">{windowTitle}</span>
    </div>
  );
};
