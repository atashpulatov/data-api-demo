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

export class _Header extends Component {
  componentDidMount = () => {
    sessionHelper.getUserInfo();
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
    const {reportArray, isSecured, t} = this.props;
    if (reportArray && reportArray.length > 0) {
      return (
        <Popover placement="bottom" content={t('Secure data')} mouseEnterDelay={1}>
          <Button className="secure-btn" disabled={isSecured} size='small' onClick={this.secureData}>
            {isSecured
              ? <MSTRIcon type='secure-access-inactive' />
              : <MSTRIcon type='secure-access-active' />}
          </Button>
        </Popover>
      );
    }
  }

  render() {
    const {userFullName = 'MicroStrategy User', userInitials, loading, t} = this.props;
    return (
      <header id='app-header'>
        <div className="user-data">
          <span id='profileImage' className={userFullName}>
            {userInitials !== null ?
              <span id='initials' alt={t('User profile')}>{userInitials}</span> :
              <img id='profile-image' src={logo} alt={t('User profile')} />
              /* TODO: When rest api returns profileImage use it as source */}
          </span>
          <span id='full-name'>{userFullName}</span>
        </div>
        <div className="header-buttons">
          {this.getSecureButton()}
          <Button id='logOut' onClick={logout} size='small' disabled={loading}>
            {t('Log out')}
          </Button>
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

