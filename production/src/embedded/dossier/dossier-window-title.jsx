import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

/**
 * This component is used to display the title of the dossier's window when the user has triggered
 * multiple object re-prompting, single re-prompting or importing actions.
 * @param {*} param0
 * @returns
 */
export const DossierWindowTitle = ({
  isReprompt, isEdit, index, total, dossierName,
}) => {
  const [t] = useTranslation('common', { i18n });

  const showMultipleRepromptMessage = isReprompt && !isEdit && total > 1;
  const showSingleRepromptMessage = isReprompt && !isEdit && total === 1;

  return (
    <h1
      title={dossierName}
      className="ant-col folder-browser-title dossier-title-margin-top"
    >
      {(() => {
        if (showMultipleRepromptMessage) {
          return `${t('Reprompt')} ${index}/${total} > ${dossierName}`;
        } if (showSingleRepromptMessage) {
          return `${t('Reprompt')} > ${dossierName}`;
        } if (isEdit) {
          return `${t('Edit Dossier')} > ${dossierName}`;
        }
        return `${t('Import Dossier')} > ${dossierName}`;
      })()}
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
