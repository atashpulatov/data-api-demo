import React from 'react';
import logo from './assets/mstr_logo.png';
import { sessionHelper } from '../storage/session-helper';
import { Button } from 'antd';
import { errorService } from '../error/error-handler';


export const Header = ({ profileImage = logo, fullName = 'MicroStrategy User', authToken }) => (
  // GET /sessions/userInfo
  // profileImage
  // fullName
  <header id='app-header'>
    <img src={profileImage} alt='User profile' /><span className='header-name'>{fullName}</span>
    <Button id='logOut' onClick={logout} size='small' hidden={!authToken}>Log out</Button>
  </header>
);

function logout() {
  try {
    sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  } catch (error) {
    errorService.handleError(error);
  }
}
