import React from 'react';
import { useTranslation } from 'react-i18next';
import { SideInfoPanel } from '@mstr/connector-components';

import { sessionHelper } from '../../storage/session-helper';

import i18n from '../../i18n';
import { ApplicationTypeEnum } from '../../office-constants';

const PrivilegeErrorSidePanel: React.FC = () => {
  const [t] = useTranslation('common', { i18n });

  return (
    <SideInfoPanel
      applicationType={ApplicationTypeEnum.EXCEL}
      panelId="no-privilege-screen"
      infoMessageHeading={t('MicroStrategy for Office')}
      infoMessageText={t('You do not have the rights to access MicroStrategy for Office')}
      onClick={() => sessionHelper.handleLogoutForPrivilegeMissing()}
      buttonText={t('Try Again')}
      buttonAriaLabel={t('Try Again')}
    />
  );
};

export default PrivilegeErrorSidePanel;
