import React from 'react';
import logo from './assets/mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import {errorService} from '../error/error-handler';
import {connect} from 'react-redux';


export const _Header = (props) => {
  const {userFullName, userInitials} = props;
  return (
    <header id='app-header'>
      <span id='profileImage'>
        {userInitials !== logo ?
          <span id='initials' alt='User profile'>{userInitials}</span> :
          <img src={userInitials} alt='User profile' />}
      </span>
      <span className='header-name'>{userFullName}</span>
      <Button id='logOut' onClick={logout} size='small'>Log out</Button>
    </header >
  );
};

function mapStateToProps(state) {
  const {userFullName, userInitials} = state.sessionReducer;
  return {userFullName, userInitials};
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
