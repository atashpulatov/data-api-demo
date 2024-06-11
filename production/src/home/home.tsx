import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { Spinner } from '@mstr/rc';

import useOfficePrivilege from '../hooks/use-office-privilege';

import { authenticationHelper } from '../authentication/authentication-helper';
import { browserHelper } from '../helpers/browser-helper';
import { sessionHelper } from '../storage/session-helper';
import { homeHelper } from './home-helper';

import officeStoreRestoreObject from '../office/store/office-store-restore-object';

import { Authenticate } from '../authentication/auth-component';
import { DevelopmentImportList } from '../development-import-list';
import i18n from '../i18n';
import { SessionExtendingWrapper } from '../popup/session-extending-wrapper';
import {
  clearGlobalNotification,
  createConnectionLostNotification,
} from '../redux-reducer/notification-reducer/notification-action-creators';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { RightSidePanel } from '../right-side-panel/right-side-panel';
import { HomeDialog } from './home-dialog';
import PrivilegeErrorSidePanel from './info-panels/privilege-error-side-panel';

import './home.css';

interface HomeProps {
  loading?: boolean;
  isDialogOpen?: boolean;
  authToken?: string | boolean;
  hideDialog?: () => void;
  toggleIsSettingsFlag?: (flag: boolean) => void;
  clearDialogState?: () => void;
  setPopupData?: (popupData: any) => void;
}

const IS_DEVELOPMENT = browserHelper.isDevelopment();

async function getUserData(authToken: string | boolean): Promise<void> {
  if (authToken) {
    sessionHelper.getTokenFromStorage();
    await sessionHelper.getUserInfo();
    await sessionHelper.getUserAttributeFormPrivilege();
  }
}

export const HomeNotConnected: React.FC<HomeProps> = props => {
  const dispatch = useDispatch();
  const {
    loading,
    isDialogOpen,
    authToken,
    hideDialog,
    toggleIsSettingsFlag,
    clearDialogState,
    setPopupData,
  } = props;

  const canUseOffice = useOfficePrivilege(authToken as string);

  const [t] = useTranslation('common', { i18n });

  const handleConnectionRestored = (): void => {
    // @ts-expect-error
    dispatch(clearGlobalNotification());
  };
  const handleConnectionLost = (): void => {
    if (!isDialogOpen) {
      // @ts-expect-error
      dispatch(createConnectionLostNotification);
    }
  };

  useEffect(() => {
    window.addEventListener('online', handleConnectionRestored);
    window.addEventListener('offline', handleConnectionLost);
    return () => {
      window.removeEventListener('online', handleConnectionRestored);
      window.removeEventListener('offline', handleConnectionLost);
    };
  });

  useEffect(() => {
    if (!isDialogOpen && !window.navigator.onLine) {
      // @ts-expect-error
      dispatch(createConnectionLostNotification());
    }
  }, [dispatch, isDialogOpen]);

  useEffect(() => {
    if (!authToken) {
      // @ts-expect-error
      dispatch(clearGlobalNotification());
    }
  });

  useEffect(() => {
    async function initializeHome(): Promise<void> {
      try {
        homeHelper.initSupportedFeaturesFlags();
        await officeStoreRestoreObject.restoreObjectsFromExcelStore();
        officeStoreRestoreObject.restoreAnswersFromExcelStore();
        authenticationHelper.saveLoginValues();
        sessionHelper.getTokenFromStorage();
        hideDialog(); // hide error popup if visible
        toggleIsSettingsFlag(false); // hide settings menu if visible
        clearDialogState();
        setPopupData(null);
        sessionActions.disableLoading();
      } catch (error) {
        console.error(error);
      }
    }
    initializeHome();
  }, [hideDialog, toggleIsSettingsFlag, clearDialogState, setPopupData]);

  useEffect(() => {
    getUserData(authToken);
  }, [authToken]);

  const renderAuthenticatePage = (): React.JSX.Element =>
    loading ? <Spinner /> : IS_DEVELOPMENT && <Authenticate />;

  const sidePanelToRender = (): React.JSX.Element => {
    if (authToken) {
      if (canUseOffice) {
        // @ts-expect-error
        return <RightSidePanel />;
      }
      return <PrivilegeErrorSidePanel />;
    }
    return renderAuthenticatePage();
  };

  return (
    <SessionExtendingWrapper id='overlay'>
      {IS_DEVELOPMENT && authToken && <DevelopmentImportList />}
      {sidePanelToRender()}
      <HomeDialog
        show={isDialogOpen}
        text={t('A MicroStrategy for Office Add-in dialog is open')}
      />
    </SessionExtendingWrapper>
  );
};

function mapStateToProps(state: any): any {
  return {
    loading: state.sessionReducer.loading,
    isDialogOpen: state.officeReducer.isDialogOpen,
    authToken: state.sessionReducer.authToken,
    shouldRenderSettings: state.officeReducer.shouldRenderSettings,
    canUseOffice: state.sessionReducer.canUseOffice,
  };
}

const mapDispatchToProps = {
  toggleRenderSettingsFlag: officeActions.toggleRenderSettingsFlag,
  hideDialog: officeActions.hideDialog,
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  clearDialogState: popupStateActions.onClearPopupState,
  setPopupData: officeActions.setPopupData,
};

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeNotConnected);
