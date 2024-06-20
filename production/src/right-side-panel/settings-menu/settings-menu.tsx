import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch, useSelector } from 'react-redux';
import { OverflowTooltip } from '@mstr/rc';
import { Dispatch } from 'redux';

import { authenticationService } from '../../authentication/authentication-service';
import { errorService } from '../../error/error-service';
import getDocumentationLocale from '../../helpers/get-documentation-locale';
import officeReducerHelper from '../../office/store/office-reducer-helper';

import packageJson from '../../../package.json';
import { dialogController } from '../../dialog/dialog-controller';
// @ts-expect-error
import logo from '../../home/assets/mstr_logo.png';
import i18n from '../../i18n';
import { officeContext } from '../../office/office-context';
import { dismissAllObjectsNotifications } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';

import './settings-menu.scss';

interface SettingsMenuProps {
  userFullName: string;
  userInitials: string;
  objects: any[];
  toggleIsSettingsFlag: (flag: boolean) => void;
  toggleIsConfirmFlag: (flag: boolean) => void;
  toggleSettingsPanelLoadedFlag: (flag: boolean) => void;
  setIsDataOverviewOpen: (flag: boolean) => void;
}

const APP_VERSION = packageJson.build;

async function logout(hideSettingsPopup: () => void, dispatch: Dispatch): Promise<void> {
  try {
    hideSettingsPopup();
    // @ts-expect-error
    dispatch(dismissAllObjectsNotifications());
    await authenticationService.logOutRest(errorService);
    sessionActions.logOut();
  } catch (error) {
    errorService.handleError(error);
  } finally {
    authenticationService.logOutRedirect(true);
  }
}

const { Office } = window;
export const SettingsMenuNotConnected: React.FC<SettingsMenuProps> = ({
  userFullName,
  userInitials,
  objects,
  toggleIsConfirmFlag,
  toggleIsSettingsFlag,
  toggleSettingsPanelLoadedFlag,
  setIsDataOverviewOpen,
}) => {
  const dispatch = useDispatch();

  const [t] = useTranslation('common', { i18n });

  const isSecured = useSelector(officeSelectors.selectIsSecured);
  const isSettings = useSelector(officeSelectors.selectIsSettings);
  const settingsPanelLoaded = useSelector(officeSelectors.selectIsSettingsPanelLoaded);
  const isOverviewWindowAPISupported = useSelector(
    officeSelectors.selectIsOverviewWindowAPISupported
  );

  const userNameDisplay = userFullName || 'MicroStrategy user';
  const isSecuredActive =
    !isSecured && objects && objects.length > 0 && officeReducerHelper.noOperationInProgress();
  const { excelApi, dialogApi } = officeContext.getRequirementSet();
  const prepareEmail = (): string => {
    if (!Office) {
      return '#';
    } // If no Office return anchor url
    const { host, platform, version } = Office.context.diagnostics;
    const userAgent = encodeURIComponent(navigator.userAgent);
    const message = t('Please don’t change the text below. Type your message above this line.');
    const officeVersion = APP_VERSION || `dev`;
    const email = {
      address: 'info@microstrategy.com',
      title: 'MicroStrategy for Office Feedback',
      body: [
        '\r\n',
        `----- ${message} ----- `,
        `Platform: ${platform} (${host})`,
        `Excel API: ${excelApi}`,
        `Dialog API: ${dialogApi}`,
        `Excel version: ${version}`,
        `MicroStrategy for Office version: ${officeVersion}`,
        `User agent: ${decodeURIComponent(userAgent)}`,
      ].join('\r\n'),
    };
    return encodeURI(`mailto:${email.address}?subject=${email.title}&body=${email.body}`);
  };

  const showImportedDataOverviewPopup = (): void => {
    if (isSecured) {
      return;
    }

    toggleIsSettingsFlag(false);
    dialogController.runImportedDataOverviewPopup();
    setIsDataOverviewOpen(true);
  };

  const showConfirmationPopup = (): void => {
    toggleIsConfirmFlag(true);
    toggleIsSettingsFlag(false);
  };

  const hideSettingsPopup = (): void => {
    toggleIsSettingsFlag(false); // close settings window
  };

  const onSelectSettingsOption = (): void => {
    hideSettingsPopup();
    toggleSettingsPanelLoadedFlag(settingsPanelLoaded);
  };

  const settingsMenuRef = React.useRef(null);

  React.useEffect(() => {
    const closeSettingsOnEsc = ({ key }: KeyboardEvent): void => {
      key === 'Escape' && toggleIsSettingsFlag(false);
    };
    const closeSettingsOnClick = (event: MouseEvent): void => {
      const { target } = event;

      if (settingsMenuRef.current && !settingsMenuRef.current.contains(target)) {
        event.stopPropagation();
        toggleIsSettingsFlag(false);
      }
    };

    const options = { capture: true };

    if (isSettings) {
      document.addEventListener('keyup', closeSettingsOnEsc);
      document.addEventListener('click', closeSettingsOnClick, options);
    }
    return () => {
      document.removeEventListener('keyup', closeSettingsOnEsc);
      document.removeEventListener('click', closeSettingsOnClick, options);
    };
  }, [isSettings, toggleIsSettingsFlag]);

  return (
    <ul className='settings-list' ref={settingsMenuRef}>
      <li id='testid' className='user-data no-trigger-close not-linked-list'>
        {userInitials !== null ? (
          <span className='no-trigger-close' id='initials'>
            {userInitials}
          </span>
        ) : (
          <img className='no-trigger-close' id='profile-image' src={logo} alt={t('User profile')} />
        )}
        <OverflowTooltip
          placement='bottom'
          portalProps={{ root: settingsMenuRef }}
          content={userNameDisplay}
        >
          <div className='user-name'>{userNameDisplay}</div>
        </OverflowTooltip>
      </li>
      {isOverviewWindowAPISupported && (
        <li
          className={`no-trigger-close imported-data-overview not-linked-list ${isSecured ? 'imported-data-overview-inactive' : ''}`}
          tabIndex={0}
          role='menuitem'
          onClick={showImportedDataOverviewPopup}
          onKeyUp={e => e.key === 'Enter' && showImportedDataOverviewPopup()}
        >
          {t('Overview')}
        </li>
      )}
      <div className='separate-line' />
      <li
        className={`no-trigger-close clear-data not-linked-list ${!isSecuredActive ? 'clear-data-inactive' : ''}`}
        tabIndex={0}
        role='menuitem'
        onClick={isSecuredActive ? showConfirmationPopup : null}
        onKeyUp={isSecuredActive ? e => e.key === 'Enter' && showConfirmationPopup() : null}
      >
        {t('Clear Data')}
      </li>
      <li
        className='no-trigger-close settings not-linked-list'
        tabIndex={0}
        role='menuitem'
        onClick={onSelectSettingsOption}
        onKeyUp={e => e.key === 'Enter' && onSelectSettingsOption()}
      >
        {t('Settings')}
      </li>
      <div className='separate-line' />
      <li className='privacy-policy'>
        <a
          tabIndex={0}
          href='https://www.microstrategy.com/legal/privacy-policy'
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('Privacy Policy')}
        </a>
      </li>
      <li>
        <a
          tabIndex={0}
          href='https://www.microstrategy.com/legal/terms-of-use'
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('Terms of Use')}
        </a>
      </li>
      <li>
        <a
          tabIndex={0}
          href={`https://www2.microstrategy.com/producthelp/Current/Office/${getDocumentationLocale(i18n.language)}/index.htm`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('Help')}
        </a>
      </li>
      <li>
        <a tabIndex={0} href={prepareEmail()} target='_blank' rel='noopener noreferrer'>
          {t('Contact Us')}
        </a>
      </li>
      <li
        className='not-linked-list'
        tabIndex={0}
        id='logOut'
        role='menuitem'
        onClick={() => logout(hideSettingsPopup, dispatch)}
        onKeyPress={() => logout(hideSettingsPopup, dispatch)}
      >
        {t('Log Out')}
      </li>
      <li className='settings-version no-trigger-close'>
        {t('Version {{APP_VERSION}}', { APP_VERSION })}
        <div>{`ExcelAPI: ${excelApi} / DialogAPI: ${dialogApi}`}</div>
      </li>
    </ul>
  );
};

function mapStateToProps(state: any): any {
  const { sessionReducer, objectReducer } = state;
  const { userFullName, userInitials, userID } = sessionReducer;
  const { objects } = objectReducer;
  return {
    userFullName,
    userInitials,
    userID,
    objects,
  };
}

const mapDispatchToProps = {
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  toggleIsConfirmFlag: officeActions.toggleIsConfirmFlag,
  toggleSettingsPanelLoadedFlag: officeActions.toggleSettingsPanelLoadedFlag,
  setIsDataOverviewOpen: popupStateActions.setIsDataOverviewOpen,
};
export const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(SettingsMenuNotConnected);