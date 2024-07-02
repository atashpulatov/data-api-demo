import React from 'react';
import { useTranslation } from 'react-i18next';
import { OfficeApplicationType, SideInfoPanel } from '@mstr/connector-components';

import { authenticationService } from '../../authentication/authentication-service';
import { errorService } from '../../error/error-service';

import i18n from '../../i18n';

const PrivilegeErrorSidePanel: React.FC = () => {
  const [t] = useTranslation('common', { i18n });

  return (
    <SideInfoPanel
      applicationType={OfficeApplicationType.EXCEL}
      panelId='no-privilege-screen'
      infoMessageHeading={t('MicroStrategy for Office')}
      infoMessageText={t('You do not have the rights to access MicroStrategy for Office')}
      onClick={() => authenticationService.handleLogoutForPrivilegeMissing(errorService)}
      buttonText={t('Try Again')}
      buttonAriaLabel={t('Try Again')}
    />
  );
};

export default PrivilegeErrorSidePanel;
