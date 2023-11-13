import React from 'react';

// @ts-ignore
import { SideInfoPanel } from '@mstr/connector-components';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { sessionHelper } from '../../storage/session-helper';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';
import { errorService } from '../../error/error-handler';

const PrivilegeErrorSidePanel: React.FC = () => {
  const [t] = useTranslation('common', { i18n });

  const handleTryAgain = async () => {
    try {
      await sessionHelper.logOutRest();
      sessionActions.logOut();
    } catch (error) {
      errorService.handleError(error);
    } finally {
      sessionHelper.logOutRedirect(true);
    }
  };

  return (
    <SideInfoPanel
      applicationType="EXCEL"
      panelId="no-privilege-screen"
      infoMessageHeading={t('MicroStrategy for Office')}
      infoMessageText={t('You do not have the rights to access MicroStrategy for Office')}
      onClick={() => handleTryAgain()}
      buttonText={t('Try Again')}
      buttonAriaLabel={t('Try Again')}
    />
  );
};

export default PrivilegeErrorSidePanel;
