import React, {Component} from 'react';
import logo from './assets/mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import {errorService} from '../error/error-handler';
import {connect} from 'react-redux';
import {userRestService} from './user-rest-service';
import {homeHelper} from './home-helper';


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
  }

  render() {
    const {userFullName, userInitials, loading} = this.props;
    return (
      <header id='app-header'>
        <span id='profileImage' className={userFullName && 'got-user-data'}>
          {userInitials !== null ?
            <span id='initials' alt='User profile'>{userInitials}</span> :
            <img id='profile-image' src={logo} alt='User profile' />
            /* TODO: When rest api returns profileImage use it as source*/}
        </span>
        <span className={` ${userFullName && 'got-user-data'} header-name`}>{userFullName}</span>
        <Button id='logOut' onClick={logout} size='small' disabled={loading}>Log out</Button>
      </header >
    );
  };
}

function mapStateToProps(state) {
  const {userFullName, userInitials, envUrl, authToken} = state.sessionReducer;
  return {userFullName, userInitials, envUrl, authToken};
};

export const Header = connect(mapStateToProps)(_Header);

async function logout() {
  try {
    await sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  } catch (error) {
    errorService.handleError(error);
  }
}

