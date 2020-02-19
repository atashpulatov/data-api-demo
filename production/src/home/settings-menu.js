import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import {
  toggleIsConfirmFlag as toggleIsConfirmFlagImported,
  toggleIsSettingsFlag as toggleIsSettingsFlagImported
} from '../office/office-actions';
import logo from './assets/mstr_logo.png';
import overflowHelper from '../helpers/helpers';
import { sessionHelper } from '../storage/session-helper';
import { errorService } from '../error/error-handler';
import { clearCache as clearCacheImported } from '../cache/cache-actions';
import DB from '../cache/cache-db';
import { officeContext } from '../office/office-context';

const APP_VERSION = process.env.REACT_APP_MSTR_OFFICE_VERSION;

export const SettingsMenuNotConnected = ({
  userFullName,
  userID,
  userInitials,
  isSecured,
  reportArray,
  t,
  toggleIsConfirmFlag,
  toggleIsSettingsFlag,
  clearCache,
}) => {
  const userNameDisplay = userFullName || 'MicroStrategy user';
  const isSecuredActive = !isSecured && reportArray && reportArray.length > 0;
  const prepareEmail = () => {
    const { Office } = window;
    if (!Office) { return '#'; } // If no Office return anchor url
    const { host, platform, version } = Office.context.diagnostics;
    const excelAPI = officeContext.getRequirementSet();
    const { userAgent } = navigator;
    const message = t('Please don’t change the text below. Type your message above this line.');
    const email = {
      address: 'info@microstrategy.com',
      title: 'MicroStrategy for Office Feedback',
      body: [
        '%0D%0A %0D%0A ',
        `----- ${message} ----- `,
        `Platform: ${platform} (${host})`,
        `Excel API: ${excelAPI}`,
        `Excel version: ${version}`,
        `MicroStrategy for Office version: ${APP_VERSION || `dev`}`,
        `User agent: ${userAgent}`,
      ].join('%0D%0A'),
    };
    return `mailto:${email.address}?subject=${email.title}&body=${email.body}`;
  };

  const showConfirmationPopup = () => {
    toggleIsConfirmFlag(true);
    toggleIsSettingsFlag(false);
  };


  return (
    <ul className="settings-list">
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
      <li className={`no-trigger-close clear-data not-linked-list ${!isSecuredActive ? 'clear-data-inactive' : ''}`}>
        <span
        className="no-trigger-close"
        tabIndex="0"
        role="button"
        onClick={isSecuredActive ? showConfirmationPopup : null}
        onKeyUp={isSecuredActive ? showConfirmationPopup : null}>
          {t('Clear Data')}
        </span>
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
          href="https://www2.microstrategy.com/producthelp/Current/Office/index.htm"
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
      <li className="not-linked-list">
        <span tabIndex="0"
              id="logOut"
              size="small"
              role="button"
              onClick={() => logout(() => clearCache(userID))}
              onKeyUp={() => logout(() => clearCache(userID))}>
          {t('Log Out')}
        </span>
      </li>
      <li className="settings-version no-trigger-close">{t('Version {{APP_VERSION}}', { APP_VERSION })}</li>
    </ul>
  );
};

SettingsMenuNotConnected.defaultProps = { t: (text) => text, };

function mapStateToProps({ sessionReducer, officeReducer }) {
  const { userFullName, userInitials, userID } = sessionReducer;
  const { isSecured, reportArray } = officeReducer;
  return {
    userFullName, userInitials, isSecured, reportArray, userID
  };
}

const mapDispatchToProps = {
  toggleIsSettingsFlag : toggleIsSettingsFlagImported,
  toggleIsConfirmFlag: toggleIsConfirmFlagImported,
  clearCache: clearCacheImported,
};
export const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(SettingsMenuNotConnected));

async function logout(preLogout) {
  try {
    await sessionHelper.logOutRest();
    sessionHelper.logOut();
    if (DB.getIndexedDBSupport()) { await preLogout(); }
  } catch (error) {
    errorService.handleError(error);
  } finally {
    sessionHelper.logOutRedirect();
  }
}

SettingsMenuNotConnected.propTypes = {
  userID: PropTypes.number,
  userFullName: PropTypes.string,
  userInitials: PropTypes.string,
  isSecured: PropTypes.bool,
  reportArray: PropTypes.arrayOf(PropTypes.shape({})),
  toggleIsSettingsFlag: PropTypes.func,
  toggleIsConfirmFlag: PropTypes.func,
  clearCache: PropTypes.func,
  t: PropTypes.func
};
