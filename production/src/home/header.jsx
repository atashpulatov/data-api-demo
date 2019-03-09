import React, {Component} from 'react';
import logo from './assets/mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import {errorService} from '../error/error-handler';
import {connect} from 'react-redux';
import {userRestService} from './user-rest-service';


export class _Header extends Component {
  componentDidMount = async () => {
    const {envUrl, authToken} = this.props;
    const userData = await userRestService.getUserData(authToken, envUrl);
    sessionHelper.saveUserInfo(userData);
  }

  render() {
    const {userFullName, userInitials} = this.props;
    return (
      <header id='app-header'>
        <span id='profileImage'>
          {userInitials !== null ?
            <span id='initials' alt='User profile'>{userInitials}</span> :
            <img src={logo} alt='User profile' />
            /* TODO: When rest api returns profileImage use it as source*/}
        </span>
        <span className='header-name'>{userFullName}</span>
        <Button id='logOut' onClick={logout} size='small'>Log out</Button>
      </header >
    );
  };
}

function mapStateToProps(state) {
  const {userFullName, userInitials, envUrl, authToken} = state.sessionReducer;
  return {userFullName, userInitials, envUrl, authToken};
};

export const Header = connect(mapStateToProps)(_Header);

function logout() {
  try {
    sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  } catch (error) {
    errorService.handleError(error);
  }
}

