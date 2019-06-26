import React, {Component} from 'react';
import logo from './assets/mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button, Popover} from 'antd';
import {errorService} from '../error/error-handler';
import {connect} from 'react-redux';
import {userRestService} from './user-rest-service';
import {homeHelper} from './home-helper';
import {withTranslation} from 'react-i18next';
import {officeApiHelper} from '../office/office-api-helper';
import {toggleSecuredFlag} from '../office/office-actions';
import {MSTRIcon} from 'mstr-react-library';
import mstrLogo from './assets/mstr_logo.png';

const BUILD_NUMBER = '11.1';


export class _Header extends Component {
  constructor() {
    super();
    this.state = {isSettings: false};
  }

  componentDidMount = async () => {
    let userData = {};
    const IS_LOCALHOST = this.props.IS_LOCALHOST;
    const envUrl = IS_LOCALHOST ? this.props.envUrl : homeHelper.saveLoginValues();
    const authToken = IS_LOCALHOST ? this.props.authToken : homeHelper.saveTokenFromCookies();
    try {
      userData = await userRestService.getUserData(authToken, envUrl);
    } catch (error) {
      errorService.handleError(error, !IS_LOCALHOST);
    }
    !this.props.userFullName && sessionHelper.saveUserInfo(userData);
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
    if (this.state.isSettings && !e.target.classList.contains('not-clickable')) {
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

  getSecureButton = () => {
    const {reportArray, isSecured, loading, t} = this.props;
    if (reportArray && reportArray.length > 0) {
      return (
        <Popover placement="bottom" content={t('Secure data')} mouseEnterDelay={1}>
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
        <li id="testid" className="user-data not-clickable">
          {userInitials !== null ?
          <span className="not-clickable" id='initials' alt={t('User profile')}>{userInitials}</span> :
          <img className="not-clickable" id='profile-image' src={logo} alt={t('User profile')} />
          /* TODO: When rest api returns profileImage use it as source */}
          <span className="user-name not-clickable">{userFullName}</span>
        </li>
        {/* TODO: url's for menu items will be added later */}
        <li><a href='' target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
        <li><a href='' target="_blank" rel="noopener noreferrer">Terms of Use</a></li>
        <li><a href='' target="_blank" rel="noopener noreferrer">Help</a></li>
        <li className="settings-version not-clickable">Version {BUILD_NUMBER}</li>
        <li className="not-clickable">
          <div className="contact-us">
            <span><a href='' target="_blank" rel="noopener noreferrer">Contact Us</a></span>
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
          <Button className="settings-btn not-clickable" onClick={this.toggleSettings} disabled={loading}>
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

