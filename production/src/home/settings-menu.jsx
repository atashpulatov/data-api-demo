import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { OverflowTooltip } from '@mstr/rc';
import i18n from '../i18n';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import logo from './assets/mstr_logo.png';
import { sessionHelper } from '../storage/session-helper';
import { errorService } from '../error/error-handler';
import { officeContext } from '../office/office-context';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { clearAnswers as clearAnswersImported } from '../redux-reducer/answers-reducer/answers-actions';
import './settings-menu.scss';
import { notificationService } from '../notification-v2/notification-service';
import packageJson from '../../package.json';
import getDocumentationLocale from '../helpers/get-documentation-locale';
import officeStoreObject from '../office/store/office-store-object';

const APP_VERSION = packageJson.build;
const REUSE_PROMPT_ANSWERS_FEATURE = 'reusePrompAnswersFeatureEnabled';

const { Office, localStorage } = window;
export const SettingsMenuNotConnected = ({
  userFullName,
  userID,
  userInitials,
  isSecured,
  objects,
  toggleIsConfirmFlag,
  toggleIsSettingsFlag,
  settingsPanelLoaded,
  toggleSettingsPanelLoadedFlag,
  clearSavedPromptAnswers,
  isSettings
}) => {
  const [t] = useTranslation('common', { i18n });
  const reusePrompAnswersFeatureEnabled = JSON.parse(localStorage.getItem(REUSE_PROMPT_ANSWERS_FEATURE));

  const userNameDisplay = userFullName || 'MicroStrategy user';
  const isSecuredActive = !isSecured && objects && objects.length > 0;
  const prepareEmail = () => {
    if (!Office) { return '#'; } // If no Office return anchor url
    const { host, platform, version } = Office.context.diagnostics;
    const excelAPI = officeContext.getRequirementSet();
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
        `Excel API: ${excelAPI}`,
        `Excel version: ${version}`,
        `MicroStrategy for Office version: ${officeVersion}`,
        `User agent: ${decodeURIComponent(userAgent)}`,
      ].join('\r\n'),
    };
    return encodeURI(`mailto:${email.address}?subject=${email.title}&body=${email.body}`);
  };

  const showConfirmationPopup = () => {
    toggleIsConfirmFlag(true);
    toggleIsSettingsFlag(false);
  };

  const preLogout = async () => {
    toggleIsSettingsFlag(false); // close settings window
    // clear stored prompt answers from Redux store, then clear cached prompt values in Excel Store
    clearSavedPromptAnswers();
    await officeStoreObject.saveAnswersInExcelStore();
  };

  const settingsMenuRef = React.useRef(null);

  React.useEffect(() => {
    const closeSettingsOnEsc = ({ keyCode }) => {
      keyCode === 27 && toggleIsSettingsFlag(false);
    };
    const closeSettingsOnClick = ({ target }) => {
      settingsMenuRef.current
          && !settingsMenuRef.current.contains(target)
          && toggleIsSettingsFlag(false);
    };
    if (isSettings) {
      document.addEventListener('keyup', closeSettingsOnEsc);
      document.addEventListener('click', closeSettingsOnClick);
    }
    return () => {
      document.removeEventListener('keyup', closeSettingsOnEsc);
      document.removeEventListener('click', closeSettingsOnClick);
    };
  }, [isSettings, toggleIsSettingsFlag]);

  return (
    <ul className="settings-list" ref={settingsMenuRef}>
      <li id="testid" className="user-data no-trigger-close not-linked-list">
        {userInitials !== null
          ? <span className="no-trigger-close" id="initials" alt={t('User profile')}>{userInitials}</span>
          : <img className="no-trigger-close" id="profile-image" src={logo} alt={t('User profile')} />}
        <OverflowTooltip placement="bottom" theme="dark" content={userNameDisplay} mouseEnterDelay={1} containerClassName="user-name-tooltip" sourceClassName="user-name">{userNameDisplay}</OverflowTooltip>
      </li>
      <li
        className={`no-trigger-close clear-data not-linked-list ${!isSecuredActive ? 'clear-data-inactive' : ''}`}
        tabIndex="0"
        role="menuitem"
        onClick={isSecuredActive ? showConfirmationPopup : null}
        onKeyUp={isSecuredActive ? (e) => (e.key === 'Enter' && showConfirmationPopup()) : null}>
        {t('Clear Data')}
      </li>
      {reusePrompAnswersFeatureEnabled && (
        <li
          className="no-trigger-close settings not-linked-list"
          tabIndex="0"
          role="menuitem"
          onClick={() => toggleSettingsPanelLoadedFlag(settingsPanelLoaded)}
          onKeyUp={(e) => (e.key === 'Enter' && toggleSettingsPanelLoadedFlag(settingsPanelLoaded))}>
          {t('Settings')}
        </li>
      )}
      <div className="separate-line" />
      <li className="privacy-policy">
        <a
          tabIndex="0"
          href="https://www.microstrategy.com/legal-folder/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('Privacy Policy')}
        </a>
      </li>
      <li>
        <a
          tabIndex="0"
          href="https://www.microstrategy.com/legal-folder/legal-policies/terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('Terms of Use')}
        </a>
      </li>
      <li>
        <a
          tabIndex="0"
          href={`https://www2.microstrategy.com/producthelp/Current/Office/${getDocumentationLocale(i18n.language)}/index.htm`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('Help')}
        </a>
      </li>
      <li>
        <a
          tabIndex="0"
          href={prepareEmail()}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('Contact Us')}
        </a>
      </li>
      <li
        className="not-linked-list"
        tabIndex="0"
        id="logOut"
        size="small"
        role="menuitem"
        onClick={() => logout(preLogout)}
        onKeyPress={() => logout(preLogout)}>
        {t('Log Out')}
      </li>
      <li className="settings-version no-trigger-close">{t('Version {{APP_VERSION}}', { APP_VERSION })}</li>
    </ul>
  );
};

function mapStateToProps({ sessionReducer, officeReducer, objectReducer }) {
  const { userFullName, userInitials, userID } = sessionReducer;
  const { isSecured, isSettings, settingsPanelLoaded } = officeReducer;
  const { objects } = objectReducer;
  return {
    userFullName, userInitials, isSecured, userID, isSettings, settingsPanelLoaded, objects
  };
}

const mapDispatchToProps = {
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  toggleIsConfirmFlag: officeActions.toggleIsConfirmFlag,
  toggleSettingsPanelLoadedFlag: officeActions.toggleSettingsPanelLoadedFlag,
  clearSavedPromptAnswers: clearAnswersImported
};
export const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(SettingsMenuNotConnected);

async function logout(preLogout) {
  try {
    await preLogout();
    notificationService.dismissNotifications();
    await sessionHelper.logOutRest();
    sessionActions.logOut();
  } catch (error) {
    errorService.handleError(error);
  } finally {
    sessionHelper.logOutRedirect(true);
  }
}

SettingsMenuNotConnected.propTypes = {
  userID: PropTypes.string,
  userFullName: PropTypes.string,
  userInitials: PropTypes.string,
  isSecured: PropTypes.bool,
  settingsPanelLoaded: PropTypes.bool,
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  toggleIsSettingsFlag: PropTypes.func,
  toggleIsConfirmFlag: PropTypes.func,
  toggleSettingsPanelLoadedFlag: PropTypes.func,
  clearSavedPromptAnswers: PropTypes.func,
  isSettings: PropTypes.bool,
};
