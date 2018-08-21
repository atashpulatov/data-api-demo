import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import logo from '../public/assets/mstr_logo.png';

const Header = () => (
    <header id='app-header'>
        <img src={logo} id='header-image' />
        <p id='header'>Microstrategy Office</p>
    </header>
);

export default Header;
