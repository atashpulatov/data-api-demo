import React from 'react';
import logo from './mstr_logo.png';

export const Header = ({profileImage = logo, fullName = 'MicroStrategy User'}) => (
  // GET /sessions/userInfo
  // profileImage
  // fullName
  <header id='app-header'>
    <img src={profileImage} alt='User profile' /><span className='header-name'>{fullName}</span>
  </header>
);

