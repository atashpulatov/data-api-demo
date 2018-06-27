import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

let back = '<';
let forward = '>';

const MenuBar = () => (

    <div id='menu-bar-container'>
        <button className='menu-button'>{back}</button>
        <button className='menu-button'>{forward}</button>
        <button className='menu-button'>log out</button>
        <button className='menu-button'>settings</button>
    </div>
);

export default MenuBar;
