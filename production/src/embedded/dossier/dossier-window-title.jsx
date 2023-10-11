import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

/**
 * This component is used to display the title of the dossier's window when the user has triggered
 * multiple object re-prompting, single re-prompting or importing actions.
 * @returns string customized text for the dossier's window title.
 */
export const DossierWindowTitle = ({
  isReprompt, isEdit, index, total, dossierName,
}) => {
  const [t] = useTranslation('common', { i18n });

  const showMultipleRepromptMessage = isReprompt && !isEdit && total > 1;
  const showSingleRepromptMessage = isReprompt && !isEdit && total === 1;

  let dossierTitle = `${t('Import Dossier')} &gt; ${dossierName}`;

  if (isEdit) {
    dossierTitle = `${t('Edit Dossier')} &gt; ${dossierName}`;
  } else if (showMultipleRepromptMessage) {
    dossierTitle = `${t('Reprompt')} ${index}/${total} &gt; ${dossierName}`;
  } else if (showSingleRepromptMessage) {
    dossierTitle = `${t('Reprompt')} &gt; ${dossierName}`;
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

DossierWindowTitle.propTypes = {
  index: PropTypes.number,
  total: PropTypes.number,
  dossierName: PropTypes.string,
  isReprompt: PropTypes.bool,
  isEdit: PropTypes.bool,
};

DossierWindowTitle.defaultProps = {
  isReprompt: false,
  isEdit: false,
  index: 0,
  total: 0,
  dossierName: '',
};
