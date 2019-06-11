import React, {Component} from 'react';
import logo from './assets/mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import {errorService} from '../error/error-handler';
import {connect} from 'react-redux';
import {userRestService} from './user-rest-service';
import {homeHelper} from './home-helper';
import {withTranslation} from 'react-i18next';
import {officeStoreService} from '../office/store/office-store-service';
import {officeApiHelper} from '../office/office-api-helper';
import {toggleStoreSecuredFlag} from '../office/office-actions';
import {MSTRIcon} from 'mstr-react-library';
export class _Header extends Component {
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
  };

  secureData = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      this.props.reportArray.forEach((report) => {
        officeApiHelper.deleteObjectTableBody(excelContext, report);
      });
      await excelContext.sync();
      this.toggleSecured(true);
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  }

  toggleSecured = (isSecured) => {
    officeStoreService.toggleFileSecuredFlag(isSecured);
    this.props.toggleStoreSecuredFlag(isSecured);
  }

  render() {
    const {userFullName, userInitials, loading, isSecured, t} = this.props;
    return (
      <header id='app-header'>
        <span id='profileImage' className={userFullName && 'got-user-data'}>
          {userInitials !== null ?
            <span id='initials' alt={t('User profile')}>{userInitials}</span> :
            <img id='profile-image' src={logo} alt={t('User profile')} />
            /* TODO: When rest api returns profileImage use it as source*/}
        </span>
        <span className={` ${userFullName && 'got-user-data'} header-name`}>{userFullName}</span>
        <Button className="secure-btn" disabled={isSecured} size='small' style={{float: 'right'}} onClick={this.secureData}>
          {isSecured ? <MSTRIcon type='secure-access-inactive' /> : <MSTRIcon type='secure-access-active' />}
        </Button>
        <Button id='logOut' onClick={logout} size='small' disabled={loading}>
          {t('Log out')}
        </Button>
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
  toggleStoreSecuredFlag,
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

