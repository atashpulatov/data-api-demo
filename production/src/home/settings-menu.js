import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {toggleIsConfirmFlag} from '../office/office-actions';
import logo from './assets/mstr_logo.png';
import {helper} from '../helpers/helpers';
import {Popover} from 'antd';
import {sessionHelper} from '../storage/session-helper';
import {errorService} from '../error/error-handler';

const APP_VERSION = process.env.REACT_APP_MSTR_OFFICE_VERSION;

export const _SettingsMenu = ({userFullName, userInitials, isSecured, t, toggleIsConfirmFlag}) => {
  const userNameDisplay = userFullName || t('MicroStrategy user');

  const prepareEmail = () => {
    const {host, platform, version} = window.Office.context.diagnostics;
    const userAgent = navigator.userAgent;
    const message = t('Please don’t change the text below. Type your message above this line.');
    const email = {
      address: 'info@microstrategy.com',
      title: 'MicroStrategy for Office Feedback',
      body: [
        `%0D%0A %0D%0A `,
        `----- ${message} ----- `,
        `Platform: ${host}/${platform}`,
        `Excel version: ${version}`,
        `MicroStrategy for Office version: ${APP_VERSION}`,
        `User agent: ${userAgent}`,
      ].join('%0D%0A'),
    };
    return `mailto:${email.address}?subject=${email.title}&body=${email.body}`;
  };

  return (
    <ul className="settings-list">
      <li id="testid" className="user-data no-trigger-close">
        {userInitials !== null ?
          <span className="no-trigger-close" id='initials' alt={t('User profile')}>{userInitials}</span> :
          <img className="no-trigger-close" id='profile-image' src={logo} alt={t('User profile')} />
          /* TODO: When rest api returns profileImage use it as source */}
        {helper.isOverflown(userNameDisplay, 130) ?
          <Popover placement="bottom" content={userNameDisplay} mouseEnterDelay={1}>
            <span id="userName" className="user-name no-trigger-close">{userNameDisplay}</span>
          </Popover> :
          <span id="userName" className="user-name no-trigger-close">{userNameDisplay}</span>
        }
      </li>
      <li tabIndex='0' className={`no-trigger-close clear-data ${isSecured ? 'clear-data-inactive' : ''}`} onClick={!isSecured ? () => toggleIsConfirmFlag(true) : ''}>
        <span className='no-trigger-close'>{t('Clear Data')} </span>
      </li>
      <li>
        <a
          tabIndex="0"
          href='https://www.microstrategy.com/legal-folder/privacy-policy'
          target="_blank"
          rel="noopener">{t('Privacy Policy')}</a>
      </li>
      <li>
        <a
          tabIndex="0"
          href='https://www.microstrategy.com/legal-folder/legal-policies/terms-of-use'
          target="_blank"
          rel="noopener">{t('Terms of Use')}</a>
      </li>
      <li>
        <a
          tabIndex="0"
          href=' https://www2.microstrategy.com/producthelp/Current/Office/index.htm'
          target="_blank"
          rel="noopener">{t('Help')}</a>
      </li>
      <li>
        <a
          tabIndex="0"
          href={prepareEmail()}
        >{t('Contact Us')}</a>
      </li>
      <li onClick={logout}>
        <span tabIndex="0" id="logOut" size='small'>
          {t('Logout')}
        </span>
      </li>
      < li className="settings-version no-trigger-close">{t('Version', {APP_VERSION})}</li>
    </ul >
  );
};

_SettingsMenu.defaultProps = {
  t: (text) => text,
};

function mapStateToProps({sessionReducer, officeReducer}) {
  const {userFullName, userInitials} = sessionReducer;
  const {isSecured} = officeReducer;
  return {userFullName, userInitials, isSecured};
};

const mapDispatchToProps = {
  toggleIsConfirmFlag,
};

export const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_SettingsMenu));

async function logout() {
  try {
    await sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  } catch (error) {
    errorService.handleError(error);
  }
}
