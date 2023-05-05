import React from 'react';
import { connect } from 'react-redux';
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import logo from './assets/mstr_logo.png';
import overflowHelper from '../helpers/helpers';
import { sessionHelper } from '../storage/session-helper';
import { errorService } from '../error/error-handler';
import { clearCache as clearCacheImported } from '../redux-reducer/cache-reducer/cache-actions';
import DB from '../cache/cache-db';
import { officeContext } from '../office/office-context';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import './settings-menu.scss';
import { notificationService } from '../notification-v2/notification-service';
import packageJson from '../../package.json';
import getDocumentationLocale from '../helpers/get-documentation-locale';

const APP_VERSION = packageJson.build;

const { Office } = window;

export const SettingsMenuNotConnected = ({
  userFullName,
  userID,
  userInitials,
  isSecured,
  objects,
  toggleIsConfirmFlag,
  toggleIsSettingsFlag,
  clearCache,
  isSettings
}) => {
  const [t, i18n] = useTranslation();

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
        {overflowHelper.isOverflown(userNameDisplay, 130)
          ? (
            <Popover placement="bottom" content={userNameDisplay} mouseEnterDelay={1}>
              <span id="userName" className="user-name no-trigger-close">{userNameDisplay}</span>
            </Popover>
          )
          : <span id="userName" className="user-name no-trigger-close">{userNameDisplay}</span>}
      </li>
      <li
        className={`no-trigger-close clear-data not-linked-list ${!isSecuredActive ? 'clear-data-inactive' : ''}`}
        tabIndex="0"
        role="menuitem"
        onClick={isSecuredActive ? showConfirmationPopup : null}
        onKeyUp={isSecuredActive ? (e) => (e.key === 'Enter' && showConfirmationPopup()) : null}>
        {t('Clear Data')}
      </li>
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
        onClick={() => logout(() => clearCache(userID))}
        onKeyPress={() => logout(() => clearCache(userID))}>
        {t('Log Out')}
      </li>
      <li className="settings-version no-trigger-close">{t('Version {{APP_VERSION}}', { APP_VERSION })}</li>
    </ul>
  );
};

function mapStateToProps({ sessionReducer, officeReducer, objectReducer }) {
  const { userFullName, userInitials, userID } = sessionReducer;
  const { isSecured, isSettings } = officeReducer;
  const { objects } = objectReducer;
  return {
    userFullName, userInitials, isSecured, userID, isSettings, objects
  };
}

const mapDispatchToProps = {
  toggleIsSettingsFlag: officeActions.toggleIsSettingsFlag,
  toggleIsConfirmFlag: officeActions.toggleIsConfirmFlag,
  clearCache: clearCacheImported,
};
export const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(SettingsMenuNotConnected);

async function logout(preLogout) {
  try {
    notificationService.dismissNotifications();
    await sessionHelper.logOutRest();
    sessionActions.logOut();
    if (DB.getIndexedDBSupport()) { await preLogout(); }
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
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  toggleIsSettingsFlag: PropTypes.func,
  toggleIsConfirmFlag: PropTypes.func,
  clearCache: PropTypes.func,
  isSettings: PropTypes.bool,
};