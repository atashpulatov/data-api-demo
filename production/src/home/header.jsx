import React, {Component} from 'react';
import logo from './assets/mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button, Popover} from 'antd';
import {errorService} from '../error/error-handler';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {officeApiHelper} from '../office/office-api-helper';
import {toggleSecuredFlag} from '../office/office-actions';
import {MSTRIcon} from 'mstr-react-library';
import mstrLogo from './assets/mstr_logo.png';

const APP_VERSION = process.env.REACT_APP_MSTR_OFFICE_VERSION;

export class _Header extends Component {
  constructor() {
    super();
    this.state = {isSettings: false};
  }

  componentDidMount = async () => {
    sessionHelper.getUserInfo();
    document.addEventListener('click', this.closeOnClick);
    document.addEventListener('keyup', this.closeOnTab);
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.closeOnClick);
    document.removeEventListener('keyup', this.closeOnTab);
  }

  toggleSettings = () => {
    return this.setState({...this.state, isSettings: !this.state.isSettings});
  }

  closeOnTab = (e) => {
    if (e.keyCode === 27 && this.state.isSettings) {
      this.setState({...this.state, isSettings: false});
    }
  };

  closeOnClick = (e) => {
    if (this.state.isSettings && !e.target.classList.contains('no-trigger-close')) {
      this.setState({...this.state, isSettings: false});
    }
  };

  secureData = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      this.props.reportArray.forEach((report) => {
        officeApiHelper.deleteObjectTableBody(excelContext, report);
      });
      await excelContext.sync();
      this.props.toggleSecuredFlag(true);
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  }

  sendEmail = () => {
    const {t} = this.props;
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
    return 'mailto:' + email.address + '?subject=' + email.title + '&body=' + email.body;
  }

  getSecureButton = () => {
    const {reportArray, isSecured, loading, t} = this.props;
    if (reportArray && reportArray.length > 0) {
      return (
        <Popover placement="bottom" content={t('Clear data')} mouseEnterDelay={1}>
          <Button className="secure-btn" disabled={isSecured || loading} size='small' onClick={this.secureData}>
            {isSecured
              ? <MSTRIcon type='secure-access-inactive' />
              : <MSTRIcon type='secure-access-active' />}
          </Button>
        </Popover>
      );
    }
  }

  getSettingsMenu = () => {
    const {userFullName, userInitials, t} = this.props;
    return (this.state.isSettings &&
      <ul className="settings-list">
        <li id="testid" className="user-data no-trigger-close">
          {userInitials !== null ?
            <span className="no-trigger-close" id='initials' alt={t('User profile')}>{userInitials}</span> :
            <img className="no-trigger-close" id='profile-image' src={logo} alt={t('User profile')} />
          /* TODO: When rest api returns profileImage use it as source */}
          <span className="user-name no-trigger-close">{userFullName || t('MicroStrategy user')}</span>
        </li>
        <li><a href='https://www.microstrategy.com/legal-folder/privacy-policy' target="_blank" rel="noopener">{t('Privacy Policy')}</a></li>
        <li><a href='https://www.microstrategy.com/legal-folder/legal-policies/terms-of-use' target="_blank" rel="noopener">{t('Terms of Use')}</a></li>
        {/* <li><a href='' target="_blank" rel="noopener">{t('Help')}</a></li> */}
        <li className="settings-version no-trigger-close">{t('Version', {APP_VERSION})}</li>
        <li className="no-trigger-close">
          <div className="contact-us">
            <span><a href={this.sendEmail()}>{t('Contact Us')}</a></span>
          </div>
          <div className="logout-btn">
            <Button id="logOut" size='small' onClick={logout}>
              {t('Logout')}
            </Button>
          </div>
        </li>
      </ul>);
  }

  render() {
    const {loading, t} = this.props;
    return (
      <header id='app-header'>
        <div className="mstr-logo">
          <span id='profileImage'>
            {/* TODO: Alt text for logo will be added later */}
            <img src={mstrLogo} />
          </span>
        </div>
        <div className="header-buttons">
          {this.getSecureButton()}
          <Button className="settings-btn no-trigger-close" onClick={this.toggleSettings} disabled={loading}>
            <MSTRIcon type="settings" />
          </Button>
          {this.getSettingsMenu()}
        </div>
      </header >
    );
  };
}

_Header.defaultProps = {
  t: (text) => text,
};

function mapStateToProps(state) {
  const {userFullName, userInitials, envUrl, authToken} = state.sessionReducer;
  const {reportArray, isSecured} = state.officeReducer;
  return {userFullName, userInitials, envUrl, authToken, reportArray, isSecured};
};

const mapDispatchToProps = {
  toggleSecuredFlag,
};

export const Header = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Header));

async function logout() {
  try {
    await sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  } catch (error) {
    errorService.handleError(error);
  }
}

