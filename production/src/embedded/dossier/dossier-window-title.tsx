import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { DossierWindowTitleTypes } from './dossier-window-title-types';

/**
 * This component is used to display the title of the dossier's window when the user has triggered
 * multiple object re-prompting, single re-prompting or importing actions.
 * @returns string customized text for the dossier's window title.
 */
export const DossierWindowTitle: FC<DossierWindowTitleTypes> = ({
  isReprompt, isEdit, index, total, dossierName,
}) => {
  const [t] = useTranslation('common', { i18n });

  const showMultipleRepromptMessage = isReprompt && !isEdit && total > 1;
  const showSingleRepromptMessage = isReprompt && !isEdit && total === 1;

  let dossierTitle = `${t('Import Dossier')} > ${dossierName}`;

  if (isEdit) {
    dossierTitle = `${t('Edit Dossier')} > ${dossierName}`;
  } else if (showMultipleRepromptMessage) {
    dossierTitle = `${t('Reprompt')} ${index}/${total} > ${dossierName}`;
  } else if (showSingleRepromptMessage) {
    dossierTitle = `${t('Reprompt')} > ${dossierName}`;
  }

  return (
    <div className="title-bar">
      <span>{dossierTitle}</span>
    </div>
  );
};
