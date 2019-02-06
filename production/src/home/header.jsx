import React from 'react';
import logo from './mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';


export const Header = ({profileImage = logo, fullName = 'MicroStrategy User', authToken}) => (
  // GET /sessions/userInfo
  // profileImage
  // fullName
  <header id='app-header'>
    <img src={profileImage} alt='User profile' /><span className='header-name'>{fullName}</span>
    <Button id='logOut' onClick={sessionHelper.logOut} size='small' hidden={!authToken}>Log out</Button>
  </header>
);

