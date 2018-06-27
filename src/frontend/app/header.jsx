import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import logo from '../public/assets/mstr_logo.png';

const Header = () => (
    <div id='content-header'>
        <img src={logo} className='header-image' />
        <p className='header'>Microstrategy Office</p>
    </div>
);

export default Header;
