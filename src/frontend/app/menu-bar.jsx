import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

let back = '←';
let settings = '⏣';
let logout = '⏏';

const MenuBar = () => (

    <div className='menu-bar-container'>
        <div className='menu-bar-nav-container'>
            <button className='menu-button menu-button-nav'>
                <span>{back}</span>
            </button>
        </div>
        <div className='menu-bar-options-container'>
            {/* <button className='menu-button menu-button-nav'>{forward}</button> */}
            <button className='menu-button menu-button-options'>
                <span>{logout}</span>
            </button>
            <button className='menu-button menu-button-options'>
            <span>{settings}</span>
            </button>
        </div>
    </div>
);

export default MenuBar;
