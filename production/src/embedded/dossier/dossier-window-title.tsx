import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { DossiertWindowTitleTypes } from './dossier-window-title-types';

/**
 * This component is used to display the title of the dossier's window when the user has triggered
 * multiple object re-prompting, single re-prompting or importing actions.
 * @returns string customized text for the dossier's window title.
 */
export const DossierWindowTitle = (props: DossiertWindowTitleTypes) => {
  const [t] = useTranslation('common', { i18n });
  const {
    isReprompt, isEdit, index, total, dossierName,
  } = props;

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
    <h1
      title={dossierTitle}
      className="folder-browser-title dossier-title-margin-top"
    >
      {dossierTitle}
    </h1>
  );
};

DossierWindowTitle.defaultProps = {
  isReprompt: false,
  isEdit: false,
  index: 0,
  total: 0,
  dossierName: '',
};
